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
dotenv.config();

module.exports.bootstrap = async function () {
  const adminData = {
    email: "admin@gmail.com",
    password: await sails.config.custom.bcrypt.hash("123456", 10),
    username: "admin",
    isAdmin: true,
  };
  const adminExist = await User.findOne({ email: adminData.email });
  if (!adminExist) {
    await User.create(adminData);
  }
};
