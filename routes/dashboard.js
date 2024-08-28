const express = require("express");
const router = express.Router();
const isAtuthenticated = require("../utils/checkAuthentication");
const dashboardController = require("../controllers/dashboardController");

router.get("/", isAtuthenticated, dashboardController.index);

module.exports = router;
