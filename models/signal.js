const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema(
  {
    signal: {
      type: String,
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Signal = mongoose.model("Signal", signalSchema);

module.exports = Signal;
