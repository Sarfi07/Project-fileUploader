const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res) => {
  res.send("You are logged in as" + req.user.name);
});
