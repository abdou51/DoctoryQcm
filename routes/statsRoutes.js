const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.get("/count", userJwt, statsController.getStats);
router.get(
  "/answers-per-category",
  userJwt,
  statsController.getAnswersPercentageByCategory
);
router.get(
  "/answers-per-module",
  userJwt,
  statsController.getAnswersPercentageByModule
);
router.get(
  "/answers-per-course",
  userJwt,
  statsController.getAnswersPercentageByCourse
);
module.exports = router;
