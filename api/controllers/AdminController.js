/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // dashboard: async (req, res) => {
  //   res.json({ message: "visit dashboard admin" });
  // },
  dashboard: async (req, res) => {
    const { id } = req.user.id;
    console.log("----------->", id);

    try {
      const userData = await User.find()
        .populate("posts",{select:["caption","image"]})
        .select(["username", "email","isActive"])
        .sort("createdAt DESC");
      console.log(userData);
      return res.json(userData);
    } catch (error) {
      console.log(error.message);
    }
  },
};
