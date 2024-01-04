const mongoose = require("mongoose");

const residencySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
      },
    date: {
        type: Date,
        required: true,
      },
  },
  { versionKey: false, timestamps: true }
);

const Residency = mongoose.model("Residency", residencySchema);

module.exports = Residency;
