const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    socket_id: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    reLoginCode: {
      type: String,
    },
    // One-Time Password for email verification
    otp: {
      type: String,
      select: false,
    },
    // OTP expiry time
    otp_expiry_time: {
      type: Date,
    },
    // Track password changes for JWT invalidation
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // If password is changed (and not on new document), update passwordChangedAt
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // subtract 1s to avoid token issues
  }

  next();
});

// Compare password method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Compare OTP - currently stored as plain text
userSchema.methods.correctOTP = async function (candidateOTP, userOTP) {
  return candidateOTP === userOTP;
};

// Check if user changed password after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
