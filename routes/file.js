require("dotenv");
var express = require("express");
const asyncHandler = require("express-async-handler");
var router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

router.post("/download", fileController.file_download);

router.get("/:folderId/upload", fileController.upload_get);
router.post(
  "/:folderId/upload",
  upload.single("file"),
  fileController.upload_post
);

router.get("/:fileId/view", fileController.file_details);
router.post("/delete", fileController.file_delete_post);

module.exports = router;
