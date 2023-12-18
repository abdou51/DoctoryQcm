const express = require("express");
const router = express.Router();
const signalController = require("../controllers/signalController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, signalController.createSignal);

module.exports = router;
