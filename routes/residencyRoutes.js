const express = require("express");
const router = express.Router();
const residencyController = require("../controllers/residencyController");
const userJwt = require("../middlewares/userJwt");

router.get("/", userJwt, residencyController.getResidencies);

// this will be changed to adminJwt in the bellow
router.post("/", userJwt, residencyController.createResidency);
router.delete("/:id", userJwt, residencyController.deleteResidency);

module.exports = router;
