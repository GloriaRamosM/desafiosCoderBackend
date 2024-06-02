import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/images`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix} -- ${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  onError: function (err, next) {
    Logger.error(err);
    next();
  },
});
