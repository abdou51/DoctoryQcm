const express = require("express");
const router = express.Router();
const residencyQuestionController = require("../controllers/residencyQuestionController");
const userJwt = require("../middlewares/userJwt");

router.get("/", userJwt, residencyQuestionController.getResidencyQuestions);

// this will be changed to adminJwt in the bellow
router.post("/", userJwt, residencyQuestionController.createResidencyQuestion);
router.delete("/:id", userJwt, residencyQuestionController.deleteResidencyQuestion);

module.exports = router;
