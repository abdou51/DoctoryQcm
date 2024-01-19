const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// Creating a compound index
answerSchema.index({ user: 1, question: 1 });

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
