const sharp = require("sharp");

const catchAsync = require("../util/catchAsync");
const UserModel = require("../models/userModel");
const AppError = require("../util/AppError");
const factory = require("./factory");

const multer = require("multer");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filteredData = (obj, ...filteredUserData) => {
  const filteredObject = {};

  const kys = Object.keys(obj);
  for (let i = 0; i < kys.length; i++) {
    if (filteredUserData.includes(kys[i])) filteredObject[kys[i]] = obj[kys[i]];
  }

  return filteredObject;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(UserModel);

exports.getUser = factory.getOne(UserModel);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "Failed",
    message: "This route is not defined yet",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create err if user POSTs password data
  if (req.body.password || req.body.passwordConfirmed) {
    return next(
      new AppError(
        "This route is not for password updates. Please use updateMyPassword route.",
        400
      )
    );
  }
  // 2) filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filteredData(req.body, "email", "name");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) updated user document
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    { runValidators: true, new: true }
  );
  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.deleteUser = factory.deleteOne(UserModel);

exports.updateUser = factory.updateOne(UserModel);
