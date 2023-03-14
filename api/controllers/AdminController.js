/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Retrieves all user data from the database and returns it as a JSON object.
   * @param {Object} req - page and pagesize
   * @returns {Object} Returns a JSON object of user
   * @throws {Error} Throws an error if there is any issue retrieving the data
   */
  dashboard: async (req, res) => {
    const { page, pageSize, searchTerm } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(pageSize, 10) || 10;
    const skip = (currentPage - 1) * itemsPerPage;
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = {
        or: [
          { username: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
      };
    }

    try {
      const userData = await User.find(searchQuery)
        .populate("posts", { select: ["caption", "image"] })
        .populate("comments", { limit: 10, select: ["text"] })
        .populate("likes")
        .sort("createdAt DESC")
        .skip(skip)
        .limit(itemsPerPage)
        .meta({
          makeLikeModifierCaseInsensitive: true,
        });
      const totalItems = await User.count();
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return res.json({
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        userData,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * toggle active and inactive user
   * @param {Object} req - user id
   * @returns {Object} Returns a JSON object of user
   * @throws {Error} Throws an error if there is an issue retrieving the data
   */
  toggleUserIsActive: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isActive = !user.isActive;
      const updatedUser = await User.updateOne({ id: userId }).set({
        isActive,
      });

      return res.status(200).json({ message: "ok", data: updatedUser });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    }
  },

  /**
   * Retrieves all post to specific user returns it as a JSON object.
   * @param {Object} req - id of user
   * @returns {Object} Returns a JSON object of post
   * @throws {Error} Throws an error if there is an issue retrieving posts.
   */
  postById: async (req, res) => {
    const { id } = req.params;
    try {
      const validUser = await User.findOne({ id });
      if (!validUser) {
        return res.status(404).json({ message: "invalid user" });
      }
      const post = await Posts.find({ postBy: id }).sort("createdAt DESC");
      return res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    }
  },
};
