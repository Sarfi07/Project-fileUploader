const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.folder_details = asyncHandler(async (req, res) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        subFolders: true,
        files: true,
        parent: true,
      },
    });

    console.log(folder);

    res.render("folder_details", {
      folder,
    });
  } catch (err) {
    return next(err);
  }
});

exports.folder_create_get = asyncHandler(async (req, res) => {
  res.render("folder_form", {
    title: "Create Folder",
  });
});

exports.folder_create_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }),
  asyncHandler(async (req, res, next) => {
    try {
      const newFolder = await prisma.folder.create({
        data: {
          name: req.body.name,
          parentId: req.params.id,
        },
      });

      const parentFolder = await prisma.folder.findFirst({
        where: {
          id: req.params.id,
        },
      });

      parentFolder.default_folder
        ? res.redirect("/dashboard")
        : res.redirect("/dashboard/folders/" + newFolder.id);
    } catch (err) {
      return next(err);
    }
  }),
];

// update
exports.folder_update_get = asyncHandler(async (req, res) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        id: req.params.id,
      },
    });

    res.render("folder_form", {
      folder,
      title: "Update Folder",
    });
  } catch (err) {
    return next(err);
  }
});

exports.folder_update_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }),
  asyncHandler(async (req, res, next) => {
    try {
      const updatedFolder = await prisma.folder.update({
        where: {
          id: req.params.id,
        },
        data: {
          name: req.body.name,
        },
        include: {
          parent: true,
        },
      });

      updatedFolder.default_folder
        ? res.redirect("/dashboard")
        : res.redirect("/dashboard/folders/" + updatedFolder.id);
    } catch (err) {
      return next(err);
    }
  }),
];

exports.folder_delete_get = asyncHandler(async (req, res, next) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        id: req.params.id,
      },
    });
    res.render("folder_delete", {
      folder,
    });
  } catch (err) {
    return next(err);
  }
});

exports.folder_delete_post = asyncHandler(async (req, res) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        parent: true,
      },
    });

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    await prisma.folder.deleteMany({
      where: {
        parentId: req.params.id,
      },
    });

    await prisma.folder.delete({
      where: {
        id: req.params.id,
      },
    });

    folder.parent.default_folder
      ? res.redirect("/dashboard")
      : res.redirect("/dashboard/folders/" + folder.id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting folder");
  }
});
// delete
