import multer from "multer";
import __dirname from "../../utils.js";

export const useUpload = function () {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__dirname}/public/${file.fieldname}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      //cb(null, `${uniqueSuffix} -- ${file.originalname}`);
      cb(null, `${req.params.uid}-${file.originalname}`);
    },
  });

  const upload = multer({
    storage,
    onError: function (err, next) {
      Logger.error(err);
      next();
    },
  });

  return upload;
};

// crear funcion para designar el destino ( profile, products, documents)
