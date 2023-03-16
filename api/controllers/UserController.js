/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Authenticates the user by email and password and returns a JWT token upon successful login.
   * @function login
   * @param {object} req - request object body
   * @param {object} res - response object user with token
   * @returns {object} - Response JSON object with token and user information.
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Invalid Input" });
      }

      // Check if user exists in the database
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(501).json({ message: "Invalid Email" });
      }
      // Check if user is active
      if (!user.isActive) {
        return res.status(500).json({ message: "admin deactive your account" });
      }

      // Check if the password is correct
      const passwordMatches = await sails.config.custom.bcrypt.compare(
        password,
        user.password
      );
      if (!passwordMatches) {
        return res.status(400).json({ message: "Invalid Password" });
      }

      if (user.isAdmin) {
        const token = await sails.helpers.adminToken(user.id, user.isAdmin);
        const userToken = await User.updateOne({ id: user.id }).set({ token });
        return res.json({ message: "Admin logged in successfully", userToken });
      }
      const token = await sails.helpers.jwt(user.id);
      const userToken = await User.updateOne({ id: user.id }).set({ token });
      console.log(user);

      return res.json({ message: "successfully logged in", userToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Handles user signup
   * @param {Object} req - email password username profilepic
   * @param {Object} res - created user object
   * @returns {Object} - Returns a JSON response with the registered user data or an error message
   */
  signup: async (req, res) => {
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
      let profilePic;
      if (!username || !email || !password) {
        return res.status(500).json({ message: "enter something in input" });
      }

      // Uploading the image to cloudinary and create user account
      await req.file("profilePhoto").upload(
        {
          dirname: require("path").resolve(sails.config.appPath, "assets"),
          maxBytes: 10000000,
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.serverError(err);
          }
          if (uploadedFiles.length === 0) {
            return res.badRequest("No file was uploaded");
          }
          profilePic = uploadedFiles[0].fd;
          console.log(profilePic);
          const result = await sails.config.custom.cloudinary.uploader.upload(
            profilePic,
            {
              unique_filename: true,
            }
          );

          console.log(result);

          // Delete image from local storage
          sails.config.custom.fs.unlink(profilePic, (err) => {
            if (err) {
              return console.log(err);
            }
            console.log("successfully deleted");
          });

          console.log(username, email, password, result.secure_url);

          // Check if user already exists in the database
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
          }

          // Hash the password
          const hashedPassword = await sails.config.custom.bcrypt.hash(
            password,
            10
          );
          // Create a new user in the database
          const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            profilePic: result.secure_url,
          }).fetch();

          return res.json({ message: "register successfully", data: newUser });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Retrieves posts by user ID
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response object
   * @returns {Object} - Returns a JSON response with the retrieved posts or an error message
   */
  postsByUser: async (req, res) => {
    const { id } = req.user;

    try {
      const userData = await User.findOne({ id: id }).populate("posts");
      console.log(userData);
      return res.json(userData);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Allows authenticated user to follow another user
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID and user ID to follow
   * @param {Object} res - response object
   * @returns {Object} - Returns a JSON response with the updated user object or an error message
   */
  followUser: async (req, res) => {
    const { userid } = req.params;
    try {
      const userToFollow = await User.findOne({ id: userid });

      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }
      // Add the user to the current user's following list
      const alreadyFollowing = await User.findOne({ id: req.user.id }).populate(
        "following",
        { id: userToFollow.id }
      );

      if (alreadyFollowing.following.length > 0) {
        await User.removeFromCollection(
          req.user.id,
          "following",
          userToFollow.id
        );

        // Add the current user to the other user's followers list
        await User.removeFromCollection(
          userToFollow.id,
          "followers",
          req.user.id
        );

        // Return the updated user object
        const updatedUser = await User.findOne({ id: req.user.id })
          .populate("following")
          .populate("followers");
        return res.json({ message: "successfully unfollow", updatedUser });
      }
      await User.addToCollection(req.user.id, "following", userToFollow.id);

      // Add the current user to the other user's followers list
      await User.addToCollection(userToFollow.id, "followers", req.user.id);

      // Return the updated user object
      const updatedUser = await User.findOne({ id: req.user.id })
        .populate("following")
        .populate("followers");
      return res.json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * Allows user to see following list
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response object followingList
   * @returns {Object} - Returns a JSON response with the user's following list or an error message
   */
  followingList: async (req, res) => {
    const { id } = req.user;
    try {
      const followList = await User.findOne({ id })
        .populate("following", { select: ["username"] })
        .select(["username", "email"]);
      if (followList.following.length < 1) {
        return res.status(404).json({ message: "Following list empty" });
      }
      return res.status(200).json(followList);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * Allows user to see followers list
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response object followersList
   * @returns {Object} - Returns a JSON response with the user's follower list or an error message
   */
  followersList: async (req, res) => {
    const { id } = req.user;
    try {
      const followerList = await User.findOne({ id })
        .populate("followers", { select: ["username"] })
        .select(["username", "email"]);
      if (followerList.followers.length < 1) {
        return res.status(404).json({ message: "Followers list empty" });
      }
      return res.status(200).json(followerList);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * Allows user to see posts that user like
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response object myLikelist
   * @returns {Object} - Returns a JSON response with posts that user like or an error message
   */
  myLikeList: async (req, res) => {
    const { id } = req.user;
    try {
      const myLikes = await Like.find({ user: id }).populate("post");
      if (!myLikes) {
        return res.status(404).json({ message: "Likes list empty" });
      }
      const data = myLikes.map((like) => like.post);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * Allows user to see saved posts
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response object data
   * @returns {Object} - Returns a JSON response with posts that user save or an error message
   */
  mySaveList: async (req, res) => {
    const { id } = req.user;
    try {
      const mySave = await Savedpost.find({ user: id }).populate("post");
      if (!mySave) {
        return res.status(404).json({ message: "Saved list empty" });
      }
      const data = mySave.map((like) => like.post);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Allows user to see received posts that shared by another user
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response object data
   * @returns {Object} - Returns a JSON response with posts that user receive by other or an error message
   */
  sharedPosts: async (req, res) => {
    try {
      const sharePostData = await PostShare.find({
        sharedWith: req.user.id,
      })
        .populate("post")
        .populate("shareBy");
      if (!sharePostData) {
        return res.status(404).json({ message: "Shared posts list empty" });
      }
      const data = sharePostData.map((post) => {
        return { shareBy: post.shareBy.username, post: post.post };
      });
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * get user profile
   * @param {Number} req user.id
   * @param {Object} res userData
   */
  userProfile: async (req, res) => {
    const userid = req.query.id || req.user.id;
    try {
      const userData = await User.findOne({ id: userid })
        .populate("posts")
        .populate("following")
        .populate("followers")
        .populate("comments")
        .populate("savedposts")
        .populate("sharedPosts")
        .populate("likes");

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(userData);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * Allows user to update profile
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response object with updated profile
   */
  updateProfile: async (req, res) => {
    try {
      let profilePic;
      const id = req.user.id;

      if (!req.body) {
        return res
          .status(500)
          .json({ message: "enter something in given fields" });
      }

      await req.file("profilePhoto").upload(
        {
          dirname: require("path").resolve(sails.config.appPath, "assets"),
          maxBytes: 10000000, // 10 MB
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.serverError(err);
          }
          if (uploadedFiles.length === 0) {
            return res.badRequest("No file was uploaded");
          }

          profilePic = uploadedFiles[0].fd;

          const result = await sails.config.custom.cloudinary.uploader.upload(
            profilePic,
            {
              unique_filename: true,
            }
          );

          // Delete image from local storage
          fs.unlink(profilePic, (err) => {
            if (err) {
              return console.log(err);
            }
            console.log("successfully deleted");
          });
          const { username, email } = req.body;
          console.log(username, email, result.secure_url);

          // updat user profile
          const updatedProfile = await User.updateOne({ id: id })
            .set({
              username: username,
              email: email,
              profilePic: result.secure_url,
            })
            .fetch();

          return res.json({
            message: "profile updated successfully",
            data: updatedProfile,
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * Allows user change password
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response message
   */
  changePassword: async (req, res) => {
    const id = req.user.id;
    try {
      const validUser = await User.findOne({ id });
      if (!validUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { oldPassword, newPassword } = req.body;
      const isMatch = await sails.config.custom.bcrypt.compare(
        oldPassword,
        validUser.password
      );
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const hashedPassword = await sails.config.custom.bcrypt.hash(
        newPassword,
        10
      );
      await User.updateOne({ id: id }).set({ password: hashedPassword });
      return res.status(200).json({ message: "Password changed" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * Allows user forgot password and set new password
   * @function
   * @async
   * @param {Object} req - request object with authenticated user ID
   * @param {Object} res - response message and update user
   */
  forgotPassword: async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const isUser = await User.findOne({ email: email });
      if (!isUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await sails.config.custom.bcrypt.hash(
        newPassword,
        10
      );
      await User.updateOne({ email: email }).set({ password: hashedPassword });
      return res.status(200).json({ message: "Password changed Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * A logout function that log out user
   * @param {Number} req user.id
   * @param {String} res text
   */
  logout: async (req, res) => {
    const id = req.user.id;
    try {
      req.headers["authorization"] = null;
      await User.updateOne({ id: id }).set({ token: "" });
      return res.json({ message: "successfully logged out" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * This function is used to delete user account with all the posts and comments.
   * @param {Number} req user.id
   * @param {String} res text
   */
  deleteUser: async (req, res) => {
    const userid = req.user.id;
    try {
      const delSaved = await Savedpost.destroy({ user: userid });
      const delShared = await PostShare.destroy({ shareBy: userid });
      const delComment = await Comment.destroy({ user: userid });
      const deletedLike = await Like.destroy({ user: userid });
      const deletedPost = await Posts.destroy({ postBy: userid }).meta({
        cascade: true,
      });
      const deletedUser = await User.destroy({ id: userid }).meta({
        cascade: true,
      });
      return res.json({
        message:
          "You successfully delete your account with post and comments successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
};
