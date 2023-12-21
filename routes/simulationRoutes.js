const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, simulationController.generateSimulation);
router.get("/", userJwt, simulationController.getSimulations);
router.put(
  "/:id",
  userJwt,
  simulationController.updateSimlationAnswersQuestions
);
router.delete("/:id", userJwt, simulationController.deleteSimulation);
router.get("/:id", userJwt, simulationController.getSingleSimulation);

module.exports = router;
