const Answer = require("../models/answer");
const mongoose = require("mongoose");

const createAnswer = async (req, res) => {
  try {
    const newAnswer = new Answer({
      user: req.user.userId,
      ...req.body,
    });

    const createdAnswer = await newAnswer.save();

    res.status(201).json(createdAnswer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Answer" });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (answer) {
      await answer.remove();
      res.json({ message: "Answer removed" });
    } else {
      res.status(404).json({ message: "Answer not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting Answer" });
  }
};

const getAnswersByCourseId = async (req, res) => {
  try {
    const courseId = new mongoose.Types.ObjectId(req.query.course);
    if (!courseId) {
      return res
        .status(404)
        .json({ message: "Missing Course ID in query params" });
    }
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const answers = await Answer.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $match: {
          "question.course": courseId,
          user: userId,
        },
      },
      {
        $project: {
          "question._id": 1,
        },
      },
    ]);

    res.json(answers);
  } catch (error) {
    console.error("Error getting answers by course ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAnswer,
  deleteAnswer,
  getAnswersByCourseId,
};
