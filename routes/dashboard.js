const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

const fileRouter = require("./file");
const folderRouter = require("./folder");

router.get("/", dashboardController.index);

// router.use("/file", fileRouter);
router.use("/folders", folderRouter);

module.exports = router;
