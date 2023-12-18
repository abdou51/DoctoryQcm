const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
