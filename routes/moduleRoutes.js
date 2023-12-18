const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/moduleController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", moduleController.createModule);
router.get("/", moduleController.getModules);
router.put("/:id", moduleController.updateModule);
router.delete("/:id", moduleController.deleteModule);

module.exports = router;
