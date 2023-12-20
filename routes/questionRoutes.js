const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", questionController.createQuestion);
router.get(
  "/randommodule",
  userJwt,
  questionController.getRandomQuestionsFromModule
);
router.get("/", questionController.getQuestions);
router.get("/random", questionController.generateRandom);
router.get("/details", userJwt, questionController.getQuestionsWithDetails);
router.get("/:id", userJwt, questionController.getSingleQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
