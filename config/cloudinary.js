const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project_file_uploader",
    formats: ["jpg", "png", "pdf", "docx", "mp3", "mp4"],
    public_id: (req, file) => file.originalname,
  },
});

module.exports = {
  cloudinary,
  storage,
};
