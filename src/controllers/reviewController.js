const Review = require('../models/Review');
const AcceptRequest = require('../models/AcceptRequest');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { acceptRequestId, rating, comment } = req.body;
    const userId = req.user.id; // From auth middleware

    // Verify the accept request exists and is completed
    const acceptRequest = await AcceptRequest.findOne({
      _id: acceptRequestId,
      status: "completed"
    });

    if (!acceptRequest) {
      return res.status(404).json({ message: "Completed request not found" });
    }

    // Check if user already reviewed this request
    const existingReview = await Review.findOne({ acceptRequestId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this service" });
    }

    const review = new Review({
      acceptRequestId,
      nurseId: acceptRequest.nurse_id,
      userId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a specific nurse
const getNurseReviews = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const reviews = await Review.find({ nurseId })
      .populate('userId', 'first_name last_name')
      .populate('acceptRequestId')
      .sort({ createdAt: -1 });

    const stats = await Review.getNurseRating(nurseId);

    res.status(200).json({
      reviews,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get review statistics for a nurse
const getNurseRatingStats = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const stats = await Review.getNurseRating(nurseId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews made by a specific user
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.find({ userId })
      .populate('nurseId', 'first_name last_name')
      .populate('acceptRequestId')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOneAndUpdate(
      { _id: id, userId },
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ _id: id, userId });
    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getNurseReviews,
  getNurseRatingStats,
  getUserReviews,
  updateReview,
  deleteReview
};