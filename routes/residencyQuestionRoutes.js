const express = require("express");
const router = express.Router();
const residencyQuestionController = require("../controllers/residencyQuestionController");
const userJwt = require("../middlewares/userJwt");
// const adminJwt = require("../middlewares/adminJwt");

router.get("/", userJwt, residencyQuestionController.getResidencyQuestions);


// router.post("/", adminJwt, residencyQuestionController.createResidencyQuestion);
// router.delete("/:id", adminJwt, residencyQuestionController.deleteResidencyQuestion);

module.exports = router;
