/**
 * PostsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  home: async (req, res) => {
    try {
      const postData = await Posts.find()
        .populate("user")
        .sort({ createdAt: -1 })
        .select("text image caption user");
      res.json(postData);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  createPost: async (req, res) => {
    try {
      const { text, caption } = req.body;
      const id = req.session.user.id;
      let postPic;
      await req.file("postpic").upload(
        {
          dirname: require("path").resolve(
            sails.config.appPath,
            "assets/images/posts"
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
          console.log("------------------", uploadedFiles[0]);
          let postPic = require("path").basename(uploadedFiles[0].fd);
          postPic = postPic.split("posts/")[0];
          console.log("inside  ", postPic);
        }
      );

      console.log(postPic);
      console.log(postPic, text, caption);

      const newPost = await Posts.create({
        text: text,
        image: postPic,
        caption: caption,
        postBy: id,
      }).fetch();

      console.log("newly created post ", newPost);

      // const userById = await User.findOne({ email: req.session.user.email });
      // userById.posts = await userById.posts.push(newPost);
      // const updateUser = await User.updateOne(
      //   {
      //     email: req.session.user.email,
      //   },
      //   userById
      // );

      res.send("successfully to create post page");
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  userByPost: async (req, res) => {
    const { id } = req.params;
    try {
      const userByPost = await Posts.findById(id).populate("user");
      res.json(userByPost);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  getPostsBySearch: async (req, res) => {
    const { searchQuery } = req.query;

    try {
      const posts = await Posts.find({
        text: { $regex: searchQuery, $options: "i" },
      });

      res.json({ data: posts });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      await Posts.findByIdAndRemove(id);
      res.json({ message: "Post deleted successfully." });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  likePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.id;
    try {
      const post = await Posts.findById(id);
      const isLiked = post.likes.findIndex((id) => id === String(userId));
      if (isLiked === -1) {
        post.likes.push(userId);
      } else {
        post.likes = post.likes.filter((id) => id !== String(userId));
      }
      const updatedPost = await Posts.findByIdAndUpdate(id, post, {
        new: true,
      });

      res.json({ data: updatedPost });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  commentPost: async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const userName = req.session.user.username;
    console.log("this is comment ", comment);
    try {
      const post = await Posts.findById(id);

      post.comments.push({ comment: comment, commentBy: userName });

      const updatedPost = await Posts.findByIdAndUpdate(id, post, {
        new: true,
      });

      res.json(updatedPost);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },
};
