var express = require("express");
var router = express.Router();
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/:id/upload", fileController.upload_get);
router.post("/:id/upload", upload.single("file"), fileController.upload_post);

router.get("/:id/create", folderController.folder_create_get);
router.post("/:id/create", folderController.folder_create_post);

router.get("/:id/update", folderController.folder_update_get);
router.post("/:id/update", folderController.folder_update_post);

router.get("/:id/delete", folderController.folder_delete_get);
router.post("/:id/delete", folderController.folder_delete_post);
router.get("/:id", folderController.folder_details);

module.exports = router;
