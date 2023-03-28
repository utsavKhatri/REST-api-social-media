/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const jwt = require("jsonwebtoken");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.KEY,
  api_secret: process.env.API_SECRET,
});
module.exports.custom = {
  /***************************************************************************
   *                                                                          *
   * Any other custom config this Sails app should use during development.    *
   *                                                                          *
   ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  fs,
  bcrypt,
  jwt,
  cloudinary,
};
