/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /* A function that is called when the route is hit. */
  dashboard: async (req, res) => {
    const { page, pageSize } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(pageSize, 10) || 10;
    const skip = (currentPage - 1) * itemsPerPage;

    try {
      const userData = await User.find()
        .populate("posts", { select: ["caption", "image"] })
        .select(["username", "email", "isActive"])
        .sort("createdAt DESC")
        .skip(skip)
        .limit(itemsPerPage);
      const totalItems = await User.count();
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      console.log(totalPages);

      return res.json({
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        userData,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  toggleUserIsActive: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const isActive = !user.isActive;
      const updatedUser = await User.updateOne({ id: userId }).set({
        isActive,
      });

      return res.status(200).json({ message: "ok", data: updatedUser });
    } catch (err) {
      return res.status(500).send("Internal Server Error");
    }
  },

  postById: async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Posts.find({ postBy: id }).sort("createdAt DESC");
      if (!post) {
        return res.status(404).send("Post not found");
      }
      return res.json(post);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};
