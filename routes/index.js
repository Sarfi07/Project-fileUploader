var express = require("express");
var router = express.Router();
const asyncHandler = require("express-async-handler");
const signUpController = require("../controllers/signUpController");
const authController = require("../controllers/authController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/dashboard");
});

router.get("/sign-up", signUpController.signUp_get);
router.post("/sign-up", signUpController.signUp_post);

router.get("/login", authController.login_get);
router.post("/login", authController.authenticate);

router.get("/logout", authController.logout);

module.exports = router;
