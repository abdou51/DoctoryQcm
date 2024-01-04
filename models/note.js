const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    residencyQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResidencyQuestion",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
