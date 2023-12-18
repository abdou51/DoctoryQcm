const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    choices: [
      {
        letter: {
          type: String,
          enum: ["A", "B", "C", "D", "E", "F"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
    correctAnswers: [
      {
        type: String,
        enum: ["A", "B", "C", "D", "E", "F"],
        required: true,
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
