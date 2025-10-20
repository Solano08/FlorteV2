const express = require("express");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get("/:userId", dashboardController.getOverview);

module.exports = router;
