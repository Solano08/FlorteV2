const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/:id", profileController.getProfile);
router.put("/:id", profileController.updateProfile);
router.delete("/:id", profileController.deleteProfile);
router.patch("/:id/restore", profileController.restoreProfile);

module.exports = router;
