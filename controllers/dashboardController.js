const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.index = asyncHandler(async (req, res) => {
  // Fetch user with folders, including files and subfolders
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      folder: true,
    },
  });

  const folders = await prisma.folder.findMany({
    where: {
      parentId: user.folder.id,
    },
    include: {
      files: true,
    },
  });

  console.log(folders);

  // Render the dashboard template
  res.render("dashboard", {
    user,
    folders: folders,
    defaultFolderId: user.folder.id,
  });
});
