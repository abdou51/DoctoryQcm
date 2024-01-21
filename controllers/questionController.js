const Question = require("../models/question");
const Favourite = require("../models/favourite");
const Note = require("../models/note");
const Module = require("../models/module");
const Category = require("../models/category");
const Course = require("../models/course");
const mongoose = require("mongoose");

const createQuestion = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    const module = await Module.findById(course.module);
    const category = await Category.findById(module.category);

    const newQuestion = new Question({
      category: category.id,
      module: module.id,
      course: course.id,
      ...req.body,
    });

    const createdQuestion = await newQuestion.save();

    res.status(201).json(createdQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Question" });
  }
};

const updateQuestion = async (req, res) => {
  const questionId = req.params.id;
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating Question" });
  }
};

const deleteQuestion = async (req, res) => {
  const questionId = req.params.id;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Question" });
  }
};

const getQuestions = async (req, res) => {
  try {
    const course = req.query.course;
    if (!course) {
      return res
        .status(400)
        .json({ error: "Missing course id in request query" });
    }
    const questions = await Question.find({ course: course }).select("_id");
    res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};

const getQuestionsWithDetails = async (req, res) => {
  try {
    const course = req.query.course;
    const userId = req.user.userId;
    console.log(req.user);
    if (!course) {
      return res
        .status(400)
        .json({ error: "Missing course id in request query" });
    }
    const questions = await Question.find({ course: course }).select(
      "-updatedAt -module -category -course"
    )
    .sort({ createdAt: -1 });
    let result = [];
    for (const question of questions) {
      const isFavourite = await Favourite.exists({
        user: userId,
        question: question._id,
      });
      const note = await Note.findOne({
        user: userId,
        question: question._id,
      }).select("note");
      let isFav;

      if (!isFavourite) {
        isFav = false;
      } else if (isFavourite) {
        isFav = true;
      }

      result.push({
        question: question,
        isFavourite: isFav,
        note: note,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};

const getSingleQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.userId;
    if (!questionId) {
      return res
        .status(400)
        .json({ error: "Missing Question id in request params" });
    }
    const isFavourite = await Favourite.exists({
      user: userId,
      question: questionId,
    });
    const note = await Note.findOne({
      user: userId,
      question: questionId,
    }).select("note");
    let isFav;

    if (!isFavourite) {
      isFav = false;
    } else if (isFavourite) {
      isFav = true;
    }
    const question = await Question.findOne({ _id: questionId })
      .populate({
        path: "course",
        select: "name",
      })
      .populate({
        path: "module",
        select: "name",
      })
      .populate({
        path: "category",
        select: "name",
      });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    const questionWithFavoriteStatus = {
      question: question,
      isFavourite: isFav,
      note: note,
    };

    res.json(questionWithFavoriteStatus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};
const generateRandom = async (req, res) => {
  try {
    const categoryIds = await Category.find({}, "_id");
    let result = [];
    for (const category of categoryIds) {
      const questions = await Question.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(category._id) } },
        { $sample: { size: 50 } },
        { $project: { _id: 1 } },
      ]);
      result = result.concat(questions);
    }
    res.json(result);
  } catch (error) {
    console.error("Error getting random questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getRandomQuestionsFromModule = async (req, res) => {
  try {
    const module = req.query.module;
    const questions = await Question.aggregate([
      { $match: { module: new mongoose.Types.ObjectId(module) } },
      { $sample: { size: 40 } },
    ]);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Questions" });
  }
};
module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,
  getSingleQuestion,
  generateRandom,
  getQuestionsWithDetails,
  getRandomQuestionsFromModule,
};
