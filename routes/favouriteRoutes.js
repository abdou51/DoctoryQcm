const express = require("express");
const router = express.Router();
const favouriteController = require("../controllers/favouriteController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, favouriteController.createFavourite);
router.delete("/:id", userJwt, favouriteController.removeFavourite);

module.exports = router;
