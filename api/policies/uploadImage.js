const multer = require("multer");

module.exports = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
      const filepath = new Date().getTime() + file.originalname;

      cb(null, filepath.replace(/ /g, "-"));
    },
  });
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });
  upload.single("postpic");
  return next();
};
