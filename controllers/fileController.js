const asyncHandler = require("express-async-handler");
const multer = require("multer");
exports.upload_get = asyncHandler(async (req, res) => {
  res.render("file_upload_form");
});
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.upload_post = asyncHandler(async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        folders: true,
      },
    });

    const newFile = await prisma.file.create({
      data: {
        name: req.body.name,
        path: "./uploads",
        folderId: req.params.id,
      },
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return next(err);
  }
});
