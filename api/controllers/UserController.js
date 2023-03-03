/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
const { createToken } = require("../utils");

module.exports = {
  login: async (req, res) => {
    try {
      // console.log(req.session);
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Invalid Input", error: true });
      }

      // Check if user exists in the database
      const user = await User.findOne({ email });

      // console.log('this user that search by emai =====');
      console.log(user);
      if (!user) {
        return res.json({ message: "Invalid Email", error: true });
      }

      // Check if the password is correct
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res
          .status(400)
          .json({ message: "Invalid Password", error: true });
      }

      if (user.isAdmin) {
        const token = createToken({ id: user.id, admin: user.isAdmin });
        user.token = token;
        sails.log.warn(token);
        return res.json({ message: "Admin logged in successfully", user });
      }
      /* Creating a token and setting it to the session. */
      const token = createToken(user.id);
      user.token = token;
      sails.log.warn(token);

      return res.json({ message: "successfully logged in", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  signup: async (req, res) => {
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
      let profilePic;
      await req.file("profilePhoto").upload(
        {
          dirname: require("path").resolve(
            sails.config.appPath,
            "assets/images/profile"
          ),
          maxBytes: 10000000, // 10 MB
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.serverError(err);
          }
          if (uploadedFiles.length === 0) {
            return res.badRequest("No file was uploaded");
          }
          profilePic = require("path").basename(uploadedFiles[0].fd);
          profilePic = profilePic.split("profile/");
          console.log("inside  ", profilePic);
          profilePic = profilePic[0];

          console.log(username, email, password, profilePic);

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
            profilePic,
          }).fetch();

          return res.json({ message: "register successfully", data: newUser });
        }
      );
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  },

  /* This is a function that is used to get all the posts of a perticular user. */
  postsByUser: async (req, res) => {
    const { id } = req.user;
    console.log("----------->", id);

    try {
      const userData = await User.findOne({ id: id }).populate("posts");
      console.log(userData);
      return res.json(userData);
    } catch (error) {
      console.log(error.message);
    }
  },

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
        return res.json({ message: "already follow" });
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

  unFollowUser: async (req, res) => {
    const { userid } = req.params;
    try {
      const userToUnfollow = await User.findOne({ id: userid });
      console.log("---------------  ", userToUnfollow);
      // Add the user to the current user's following list
      const alreadyFollowing = await User.findOne({ id: req.user.id }).populate(
        "following",
        { id: userToUnfollow.id }
      );

      if (alreadyFollowing.following.length > 0) {
        await User.removeFromCollection(
          req.user.id,
          "following",
          userToUnfollow.id
        );

        // Add the current user to the other user's followers list
        await User.removeFromCollection(
          userToUnfollow.id,
          "followers",
          req.user.id
        );
        const updatedUser = await User.findOne({ id: req.user.id })
          .populate("following")
          .populate("followers");
        return res.json(updatedUser);
      }

      return res.json({ message: "already unfollow" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "logout successfully" });
    });
  },
};
