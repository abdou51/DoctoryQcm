const Category = require("../models/category");
const Module = require("../models/module");
const Course = require("../models/course");
const Question = require("../models/question");
const mongoose = require("mongoose");
const Favourite = require("../models/favourite");

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
const getNumberOfFavouriteQuestionsPerCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const favouriteQuestionsPerCategory = await Category.aggregate([
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
                    { $eq: ["$favourite", true] },
                  ],
                },
              },
            },
          ],
          as: "favouriteAnswers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          favouriteQuestions: { $size: "$favouriteAnswers" },
        },
      },
    ]);

    res.status(200).json(favouriteQuestionsPerCategory);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Favourite Questions by Category" });
  }
};
const getNumberOfFavouriteQuestionsPerModule = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const categoryId = new mongoose.Types.ObjectId(req.query.category);

    const favouriteQuestionsPerModule = await Module.aggregate([
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
                    { $eq: ["$favourite", true] },
                  ],
                },
              },
            },
          ],
          as: "favouriteAnswers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          favouriteQuestions: { $size: "$favouriteAnswers" },
        },
      },
    ]);

    res.status(200).json(favouriteQuestionsPerModule);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Favourite Questions by Module" });
  }
};
const getNumberOfFavouriteQuestionsPerCourse = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const moduleId = new mongoose.Types.ObjectId(req.query.module);

    const favouriteQuestionsPerCourse = await Course.aggregate([
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
                    { $eq: ["$favourite", true] },
                  ],
                },
              },
            },
          ],
          as: "favouriteAnswers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          favouriteQuestions: { $size: "$favouriteAnswers" },
        },
      },
    ]);

    res.status(200).json(favouriteQuestionsPerCourse);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Favourite Questions by Course" });
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

const getFavouriteStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await Category.find();
    const results = await Promise.all(
      categories.map(async (category) => {
        const count = await Favourite.countDocuments({
          user: userId,
          question: {
            $in: await Question.find({ category: category._id }).select("_id"),
          },
        });
        return { category: category, count };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting favourite stats" });
  }
};
module.exports = {
  getStats,
  getFavouriteStats,
  getAnswersPercentageByCategory,
  getAnswersPercentageByModule,
  getAnswersPercentageByCourse,
  getNumberOfFavouriteQuestionsPerCategory,
  getNumberOfFavouriteQuestionsPerCourse,
  getNumberOfFavouriteQuestionsPerModule,
};
