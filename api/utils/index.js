const jwt = require("jsonwebtoken");
// const multer = ("multer");


const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "utsav", {
    expiresIn: maxAge,
  });
};

/* This is the configuration for multer. */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     const filepath = new Date().getTime() + file.originalname;

//     cb(null, filepath.replace(/ /g, "-"));
//   },
// });

/**
 * If the file is an image, then accept it, otherwise reject it
 */
// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/webp"
//   ) {
//     // eslint-disable-next-line callback-return
//     cb(null, true);
//   } else {
//     // eslint-disable-next-line callback-return
//     cb(null, false);
//   }
// };

/* This is the configuration for multer. */
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter,
// });

module.exports={ createToken };
