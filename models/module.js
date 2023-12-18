const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
