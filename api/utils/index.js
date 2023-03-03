const jwt = require("jsonwebtoken");
// const multer = ("multer");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "utsav", {
    expiresIn: maxAge,
  });
};
module.exports = { createToken };
