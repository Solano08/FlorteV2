const express = require("express");
const profileController = require("../controllers/profileController");
const { upload } = require("../utils/fileStorage");

const router = express.Router();

router.get("/:id", profileController.getProfile);
router.put("/:id", profileController.updateProfile);
router.post("/:id/avatar", upload.single("avatar"), profileController.uploadAvatar);
router.post("/:id/cover", upload.single("cover"), profileController.uploadCover);
router.delete("/:id", profileController.deleteProfile);
router.patch("/:id/restore", profileController.restoreProfile);

module.exports = router;
