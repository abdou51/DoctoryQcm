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
router.get("/", userJwt, questionController.getQuestions);
router.get("/random", userJwt, questionController.generateRandom);
router.get("/details", userJwt, questionController.getQuestionsWithDetails);
router.get("/:id", userJwt, questionController.getSingleQuestion);
// router.put("/:id", userJwt, questionController.updateQuestion);
// router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
