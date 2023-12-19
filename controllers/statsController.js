const Category = require("../models/category");
const Module = require("../models/module");
const Course = require("../models/course");
const Question = require("../models/question");
const mongoose = require("mongoose");
const Answer = require("../models/answer");

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
const getAnswersPercentageByCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const answersPerCategory = await Category.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "category",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $size: "$answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $size: "$answers" }, { $size: "$questions" }] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(answersPerCategory);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Category" });
  }
};
const getAnswersPercentageByModule = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const categoryId = new mongoose.Types.ObjectId(req.query.category);

    const answersPerModule = await Module.aggregate([
      {
        $match: {
          category: categoryId,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "module",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $size: "$answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $size: "$answers" }, { $size: "$questions" }] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(answersPerModule);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Module" });
  }
};
const getAnswersPercentageByCourse = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const moduleId = new mongoose.Types.ObjectId(req.query.module);

    const answersPerCourse = await Course.aggregate([
      {
        $match: {
          module: moduleId,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "course",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $size: "$answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $size: "$answers" }, { $size: "$questions" }] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(answersPerCourse);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Course" });
  }
};
module.exports = {
  getStats,
  getAnswersPercentageByCategory,
  getAnswersPercentageByModule,
  getAnswersPercentageByCourse,
};
