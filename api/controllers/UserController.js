/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { createToken } = require("../utils");
const bcrypt = require("bcrypt");

module.exports = {
  login: async (req, res) => {
    try {
      // console.log(req.session);
      const { email, password } = req.body;
      console.log("====================================");
      console.log(email, password);
      console.log("====================================");
      // Check if user is already logged in
      // eslint-disable-next-line eqeqeq
      if (req.session.user) {
        // return res.redirect("/home");
        res.json({message:"already logged in"});
      }

      // Check if user exists in the database
      const user = await User.findOne({ email });

      console.log("this user that search by emai =====");
      console.log(user);
      if (!user) {
        return res.json({ message: "Invalid Email", error: true });
      }

      // Check if the password is correct
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res.json({ message: "Invalid Password", error: true });
      }

      /* Creating a token and setting it to the session. */
      const token = createToken(user._id);

      // sails.log.warn(token);

      req.session.jwt = token;

      console.log("this is cookie from session " + req.session.jwt);
      // Set the session data and redirect to homepage
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin:user.isAdmin
      };

      console.log("====================================");
      sails.log.info(req.session);

      return res.json({message:"successfully logged in"});
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
        (err, uploadedFiles) => {
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
        }
      );
      console.log(profilePic);
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
      /* Setting the session data. */
      req.session.user = {
        _id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      };

      console.log("====================================");
      console.log(req.session);

      return res.json({ message: "register successfully", data: newUser });
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  },

  postsByUser: async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("posts");
    res.send(user.posts);
  },

  followUser: async (req, res) => {
    const { userid } = req.params;
    const usermId = req.session.user.id;

    try {
      console.log("this is id to follow ", usermId);
      const getuser = await User.findById(userid);
      const currentUser = await User.findById(usermId);
      const isFollow = getuser.followerlist.includes(usermId);

      // eslint-disable-next-line eqeqeq
      if (usermId == userid) {
        res.json({ message: "you can not follow yourself" });
      } else {
        if (!isFollow) {
          getuser.followerlist.push(usermId);
          currentUser.followlist.push(userid);
          const updatedUser = await User.findByIdAndUpdate(userid, getuser, {
            new: true,
          });
          const updatedCurrentUser = await User.findByIdAndUpdate(
            usermId,
            currentUser,
            {
              new: true,
            }
          );

          res.json({ data: updatedUser, myData: updatedCurrentUser });
        } else {
          res.json({ message: "you already follow this account" });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  unFollowUser: async (req, res) => {
    const { userid } = req.params;
    const usermId = req.session.user.id;

    try {
      console.log("this is id to follow ", usermId);
      const getuser = await User.findById(userid);

      const currentUser = await User.findById(usermId);
      const isFollow = currentUser.followlist.includes(userid);

      // eslint-disable-next-line eqeqeq
      if (usermId == userid) {
        res.json({ message: "you can not follow yourself" });
      } else {
        if (isFollow) {
          getuser.followerlist = getuser.followerlist.filter(
            // eslint-disable-next-line eqeqeq
            (ele) => ele != usermId
          );
          currentUser.followlist = currentUser.followlist.filter(
            // eslint-disable-next-line eqeqeq
            (ele) => ele != userid
          );
          const updatedUser = await User.findByIdAndUpdate(userid, getuser, {
            new: true,
          });
          const updatedCurrentUser = await User.findByIdAndUpdate(
            usermId,
            currentUser,
            {
              new: true,
            }
          );

          res.json({ data: updatedUser, myData: updatedCurrentUser });
        } else {
          res.json({ message: "you already unfollow this account" });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "logout successfully" });
    });
  },
};
