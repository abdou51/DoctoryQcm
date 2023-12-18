const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, noteController.createNote);
router.get("/", userJwt, noteController.getNote);
router.put("/:id", noteController.updateNote);

module.exports = router;
