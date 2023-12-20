const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/", userJwt, userController.updateUser);
router.get("/me", userJwt, userController.getMe);
module.exports = router;
