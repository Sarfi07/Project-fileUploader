const passport = require("passport");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.signUp_get = asyncHandler(async (req, res) => {
  res.render("signUpForm", {
    title: "Sign Up",
  });
});

exports.signUp_post = [
  body("username", "Username should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("name", "Name cannot be empty.").trim().isLength({ min: 1 }).escape(),
  body("password", "password should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmPassword", "Confirmation password should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hassedPassword) => {
      if (err) {
        return next(err);
      }

      const user = {
        name: req.body.name,
        username: req.body.username,
        password: hassedPassword,
        confirmPassword: req.body.confirmPassword,
      };

      if (!errors.isEmpty()) {
        console.log(errors.errors);
        res.render("signUpForm", {
          title: "Error while signing up",
          errors: errors.errors,
        });
      } else {
        try {
          // await db.insertUser(user);
          await prisma.user.create({
            data: {
              name: user.name,
              username: user.username,
              password: user.password,
            },
          });
          console.log("user created");

          const foo = await prisma.user.findMany();
          console.log(foo);
          res.redirect("/login");
        } catch (err) {
          return next(err);
        }
      }
    });
  }),
];
