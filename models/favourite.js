const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
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

const Favourite = mongoose.model("Favourite", favouriteSchema);

module.exports = Favourite;
