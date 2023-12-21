const mongoose = require("mongoose");

const residanatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Residanat = mongoose.model("Residanat", residanatSchema);

module.exports = Residanat;
