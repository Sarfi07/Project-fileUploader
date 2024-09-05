const asyncHandler = require("express-async-handler");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { cloudinary } = require("../config/cloudinary");
const axios = require("axios");
const path = require("path");

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

exports.file_details = asyncHandler(async (req, res, next) => {
  try {
    const file = await prisma.file.findFirst({
      where: {
        id: req.params.id,
      },
    });

    res.render("file_details", {
      file,
    });
  } catch (err) {
    return next("Error fetching file" + err);
  }
});

exports.file_download = asyncHandler(async (req, res, next) => {
  try {
    const { filePath, filename } = req.body;

    // Fetch the file from Cloudinary
    const response = await axios({
      url: filePath,
      method: "GET",
      responseType: "stream", // Stream the file
    });

    // Extract the file extension from the URL
    const parsedUrl = new URL(filePath);
    const extname = path.extname(parsedUrl.pathname);

    // Set the filename with the correct extension
    const completeFilename = filename + extname;

    // Set the Content-Disposition header to force download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${completeFilename}"`
    );
    res.setHeader("Content-Type", response.headers["content-type"]);

    // Pipe the response data to the client
    response.data.pipe(res);
  } catch (err) {
    next(new Error("Error downloading file: " + err.message));
  }
});
