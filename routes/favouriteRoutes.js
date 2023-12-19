const express = require("express");
const router = express.Router();
const favouriteController = require("../controllers/favouriteController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, favouriteController.createFavourite);
router.delete("/:id", userJwt, favouriteController.removeFavourite);
router.get("/categories", userJwt, favouriteController.getFavouriteCategories);
router.get("/modules", userJwt, favouriteController.getFavouriteModules);
router.get("/courses", userJwt, favouriteController.getFavouriteCourses);
router.get("/questions", userJwt, favouriteController.getFavouriteQuestions);

module.exports = router;
