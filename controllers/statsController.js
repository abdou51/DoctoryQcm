const Category = require("../models/category");
const Module = require("../models/module");
const Course = require("../models/course");
const Question = require("../models/question");

const getStats = async (req, res) => {
  try {
    const categories = await Category.countDocuments();
    const modules = await Module.countDocuments();
    const courses = await Course.countDocuments();
    const questions = await Question.countDocuments();
    res.status(200).json({ categories, modules, courses, questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error Getting Stats" });
  }
};

module.exports = {
  getStats,
};
