/* eslint-disable callback-return */
/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");
dotenv.config();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets");
  },
  filename: function (req, file, cb) {
    const filepath = new Date().getTime() + file.originalname;
    cb(null, filepath.replace(/ /g, "-"));
  },
});

/* This is the configuration for multer. */
const upload = multer({
  storage: storage,
});

const isLoggedinUser = (req, res, next) => {
  try {
    // Extract the token from req session
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).json("Unauthorized");
    }
    // Verify the token
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json("Forbidden");
      }
      // Add the decoded token to the request object
      req.user = decodedToken;
      // Call the next middleware or route handler
      console.log(decodedToken);
      const user = await User.findOne({ id: decodedToken.id });
      if (!user || !user.token) {
        return res.status(401).json("Token expired");
      }
      if (user.token !== token) {
        return res.status(401).json("Unauthorized");
      }
    });
    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).json("Forbidden");
  }
};
module.exports.bootstrap = async function () {
  sails.hooks.http.app.post(
    "/add",
    isLoggedinUser,
    upload.single("postpic"),
    async (req, res) => {
      /* Destructuring the data from the form. */
      const { caption } = req.body;
      console.log(req);
      const { postpic } = req.file;

      try {
        if (!caption) {
          return res.json("Caption is required");
        }
        const post = await Posts.create({
          caption,
          image: postpic,
          postBy: req.user.id,
        });

        /* Saving the blog data to the database. */
        return res.json(post);
      } catch (error) {
        res.status(400).json(error.message);
      }
    }
  );
};
