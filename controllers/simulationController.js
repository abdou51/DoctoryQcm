const mongoose = require("mongoose");
const Category = require("../models/category");
const Question = require("../models/question");
const Simulation = require("../models/simulation");

const generateSimulation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryIds = await Category.find({}, "_id");
    let questions = [];
    for (const category of categoryIds) {
      const randomQuestions = await Question.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(category._id) } },
        { $sample: { size: 50 } },
        { $project: { _id: 1 } },
      ]);
      questions = questions.concat(
        randomQuestions.map((question) => ({
          question: question._id,
          answers: [],
        }))
      );
    }
    const simulation = new Simulation({
      user: userId,
      questions: questions,
    });
    await simulation.save();
    await simulation.populate({
      path: "questions.question",
      select: "-course -module -createdAt -updatedAt",
    });
    res.status(201).json(simulation);
  } catch (error) {
    console.error("Error generating simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteSimulation = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const removedSimulation = Simulation.findByIdAndDelete(simulationId);
    if (!removedSimulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    res.status(200).json({ message: "Simulation deleted successfully" });
  } catch (error) {
    console.error("Error deleting simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateSimlationAnswersQuestions = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const { answers, score, timeSpent } = req.body;
    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    simulation.questions = answers;
    simulation.score = score;
    simulation.timeSpent = timeSpent;
    await simulation.save();
    res.status(200).json({ message: "Simulation updated successfully" });
  } catch (error) {
    console.error("Error updating simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getSimulations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const simulations = await Simulation.find({ user: userId })
      .select("id score updatedAt timeSpent")
      .sort("-createdAt");
    res.status(200).json(simulations);
  } catch (error) {
    console.error("Error getting simulations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getSingleSimulation = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    await simulation.populate({
      path: "questions.question",
      select: "-course -module -createdAt -updatedAt",
    });
    res.status(200).json(simulation);
  } catch (error) {
    console.error("Error getting single simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  generateSimulation,
  deleteSimulation,
  updateSimlationAnswersQuestions,
  getSimulations,
  getSingleSimulation,
};
