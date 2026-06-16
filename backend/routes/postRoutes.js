const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  exportPostsToCSV,
} = require("../controllers/postController");

// Export route must come before /:id to avoid conflicts
router.get("/export", exportPostsToCSV);

router.route("/").get(getPosts).post(createPost);
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

module.exports = router;
