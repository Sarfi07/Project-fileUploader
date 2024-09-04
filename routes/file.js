// var express = require("express");
// var router = express.Router();
// const fileController = require("../controllers/fileController");
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// router.get("/upload", fileController.upload_get);
// router.post("/upload", upload.single("file"), fileController.upload_post);

// module.exports = router;
