const mongoose = require("mongoose");

const simulationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeSpent: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        answers: {
          type: [String],
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Simulation = mongoose.model("Simulation", simulationSchema);

module.exports = Simulation;
