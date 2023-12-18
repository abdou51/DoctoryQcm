const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    deviceToken: {
      type: String,
      required: false,
      default: null,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
