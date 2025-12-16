const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { promisify } = require("util");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");

// Sign JWT token
const signToken = (userId) => {
  let expiresIn = process.env.JWT_EXPIRE || "86400000";
  if (typeof expiresIn === "string" && /^\d+$/.test(expiresIn)) {
    // nếu là number string (milliseconds), convert to seconds
    expiresIn = parseInt(expiresIn) / 1000 + "s";
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

// Register new user
exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "password"
  );

  if (!filteredBody.username) {
    let baseUsername = "";

    if (email) {
      baseUsername = email.split("@")[0];
    } else if (firstName || lastName) {
      baseUsername = `${firstName || ""}${lastName || ""}`;
    }

    filteredBody.username = baseUsername.trim().toLowerCase();
  }

  // Check if user has email exists ?
  const existing_user = await User.findOne({ email: email });

  if (existing_user && existing_user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login.",
    });
  } else if (existing_user) {
    // Update existing unverified user
    await User.findOneAndUpdate({ email: email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });
    req.userId = existing_user._id;
    next();
  } else {
    // Create new user
    const new_user = await User.create(filteredBody);
    req.userId = new_user._id;
    next();
  }
});

// Send OTP
exports.sendOTP = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 5 * 60 * 1000; // 5 minutes

  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();
  await user.save({ new: true, validateModifiedOnly: true });

  console.log("OTP for", user.email, ":", new_otp);

  res.status(200).json({
    status: "success",
    message: "OTP Sent Successfully!",
    otp: new_otp, // Remove in production
  });
});

// Verify OTP
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  }).select("+otp");

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    return res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  // OTP is correct
  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user._id,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      verified: user.verified,
    },
  });
});

// Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Both email and password are required",
    });
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !user.password) {
    return res.status(400).json({
      status: "error",
      message: "Incorrect email or password",
    });
  }

  if (!(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Please verify your email first",
    });
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Logged in successfully!",
    token,
    user_id: user._id,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      verified: user.verified,
      status: user.status,
    },
  });
});

// Protect route - verify JWT token
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "You are not logged in! Please log in to get access.",
    });
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return res.status(401).json({
      status: "error",
      message: "The user belonging to this token does no longer exist.",
    });
  }

  // Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: "error",
      message: "User recently changed password! Please log in again.",
    });
  }

  // Grant access to protected route
  req.user = currentUser;
  req.userId = currentUser._id;
  next();
});
