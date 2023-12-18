const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.get("/count", userJwt, statsController.getStats);
module.exports = router;
