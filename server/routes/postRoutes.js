const express = require("express");
const postController = require("../controllers/postController");
const { upload } = require("../utils/fileStorage");

const router = express.Router();

router.get("/", postController.listFeed);
router.post("/", upload.single("media"), postController.createPost);
router.post("/:id/reactions", postController.reactToPost);
router.post("/:id/comments", upload.single("media"), postController.addComment);
router.get("/:id/comments", postController.getComments);

module.exports = router;
