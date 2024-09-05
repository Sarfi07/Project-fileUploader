const asyncHandler = require("express-async-handler");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { cloudinary } = require("../config/cloudinary");
exports.upload_get = asyncHandler(async (req, res) => {
  res.render("file_upload_form");
});

exports.upload_post = asyncHandler(async (req, res, next) => {
  try {
    const fileSize = req.file.size;
    const fileSizeInKb = (fileSize / 1024).toFixed(2);
    const fileSizeInMb = (fileSize / (1024 * 1024)).toFixed(2);

    const newFile = await prisma.file.create({
      data: {
        name: req.body.name,
        path: req.file.path,
        sizeInKb: fileSizeInKb,
        sizeInMb: fileSizeInMb,
        folderId: req.params.folderId,
        publicId: `${process.env.PUBLIC_ID_OF_FILES}${req.file.originalname}`,
      },
    });

    const folder = await prisma.folder.findFirst({
      where: {
        id: req.params.folderId,
      },
      include: {
        subFolders: true,
        files: true,
      },
    });

    folder.default_folder
      ? res.redirect("/dashboard")
      : res.redirect("/dashboard/folders/" + folder.id);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

exports.file_delete_post = asyncHandler(async (req, res) => {
  cloudinary.uploader.destroy(req.body.publicId, async (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Failed to delete file." });
    }
  });

  // delete from db
  const file = await prisma.file.delete({
    where: {
      id: req.body.fileId,
    },
  });

  const folder = await prisma.folder.findFirst({
    where: {
      id: req.body.folderId,
    },
    include: {
      subFolders: true,
      files: true,
    },
  });

  folder.default_folder
    ? res.redirect("/dashboard")
    : res.redirect("/dashboard/folders/" + folder.id);
});
