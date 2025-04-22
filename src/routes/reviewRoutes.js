const express = require("express");
const router = express.Router();
const { 
  createReview, 
  getNurseReviews, 
  getNurseRatingStats,
  getUserReviews,
  updateReview,
  deleteReview 
} = require("../controllers/reviewController");
const auth = require("../middlewares/auth"); // تغيير المسار هنا

// استخدام auth بدلاً من protect
router.post("/", auth, createReview);
router.get("/nurse/:nurseId", getNurseReviews);
router.get("/nurse/:nurseId/stats", getNurseRatingStats);
router.get("/my-reviews", auth, getUserReviews);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;


