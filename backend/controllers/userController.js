const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/FilterObj");

// Get current user
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
});

// Update current user
exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );

  const userDoc = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: userDoc,
    message: "User Updated successfully",
  });
});

// Get all verified users (excluding current user and friends)
exports.getUsers = catchAsync(async (req, res, next) => {
  const all_users = await User.find({
    verified: true,
  }).select("firstName lastName _id avatar status");

  const this_user = req.user;

  const remaining_users = all_users.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
  );

  res.status(200).json({
    status: "success",
    data: remaining_users,
    message: "Users found successfully!",
  });
});

// Get all verified users
exports.getAllVerifiedUsers = catchAsync(async (req, res, next) => {
  const all_users = await User.find({
    verified: true,
  })
    .select("firstName lastName _id avatar status email")
    .sort({ createdAt: -1 });

  const remaining_users = all_users.filter(
    (user) => user._id.toString() !== req.user._id.toString()
  );

  res.status(200).json({
    status: "success",
    data: remaining_users,
    message: "Users found successfully!",
  });
});

// Get friend requests
exports.getRequests = catchAsync(async (req, res, next) => {
  const requests = await FriendRequest.find({
    recipient: req.user._id,
    status: "pending",
  })
    .populate("sender", "firstName lastName avatar _id email status")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: requests,
    message: "Requests found successfully!",
  });
});

// Get friends
exports.getFriends = catchAsync(async (req, res, next) => {
  const this_user = await User.findById(req.user._id).populate(
    "friends",
    "_id firstName lastName avatar email status"
  );

  res.status(200).json({
    status: "success",
    data: this_user.friends,
    message: "Friends found successfully!",
  });
});
