/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = {
  /**
   * Authenticates the user by email and password and returns a JWT token upon successful login.
   * @function login
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {object} - Response JSON object with token and user information.
   */
  login: async (req, res) => {
    try {
      // console.log(req.session);
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Invalid Input" });
      }

      // Check if user exists in the database
      const user = await User.findOne({ email });

      // console.log('this user that search by emai =====');
      console.log(user);

      if (user.isActive === false) {
        return res.status(500).json({ message: "admin deactive your account" });
      }
      if (!user) {
        return res.json({ message: "Invalid Email" });
      }

      // Check if the password is correct
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res.status(400).json({ message: "Invalid Password" });
      }

      if (user.isAdmin) {
        const token = await sails.helpers.adminToken(user.id, user.isAdmin);
        user.token = token;
        sails.log.warn(token);
        return res.json({ message: "Admin logged in successfully", user });
      }
      const token = await sails.helpers.jwt(user.id);
      user.token = token;
      sails.log.warn(token);

      return res.json({ message: "successfully logged in", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
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
          console.log("====================================");
          console.log(profilePic);
          const result = await cloudinary.uploader.upload(profilePic);

          console.log("====================================");
          console.log(result);


          // Delete image from local storage
          fs.unlink(profilePic, (err) => {
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
          const hashedPassword = await bcrypt.hash(password, 10);

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
      res.status(500).json({ message: error.message });
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
      console.log("---------------  ", userToFollow);
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
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * A logout function that retrive user profile
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
        .populate("comments");
      return res.json(userData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
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

          console.log("====================================");
          console.log(uploadedFiles[0]);
          console.log("====================================");
          profilePic = uploadedFiles[0].fd;

          const result = await cloudinary.uploader.upload(profilePic);

          // Delete image from local storage
          fs.unlink(profilePic, (err) => {
            if (err) {
              return console.log(err);
            }
            console.log("successfully deleted");
          });
          const { username, email } = req.body;
          console.log(username, email, result.secure_url);

          // Create a new user in the database
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
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * A logout function that log out user
   * @param {Number} req user.id
   * @param {String} res text
   */
  logout: (req, res) => {
    try {
      req.headers["authorization"] = null;
      return res.json({ message: "successfully logged out" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
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
      const deletedComment = await Comment.destroy({ user: userid });
      const deletedPost = await Posts.destroy({ postBy: userid });
      const deletedUser = await User.destroy({ id: userid });
      return res.json({
        message:
          "You successfully delete your account with post and comments successfully.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};
