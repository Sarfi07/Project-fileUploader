const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("logInForm");
});

exports.authenticate = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
});

exports.logout = asyncHandler(async (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
  });

  res.redirect("/login");
});
