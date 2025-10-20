const express = require("express");
const projectController = require("../controllers/projectController");

const router = express.Router();

router.get("/", projectController.listByUser);
router.get("/:id", projectController.getProject);
router.post("/", projectController.createProject);

module.exports = router;
