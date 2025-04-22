// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//   requestId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Request", 
//     required: true,
//   },
//   nurseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "nurse", 
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5,
//   },
//   comment: {
//     type: String,
//     required: false,
//   },
// }, { timestamps: true });

// const Review = mongoose.model("Review", reviewSchema);
// module.exports = Review;

const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  acceptRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcceptRequest",
    required: true
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "nurse",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: false,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


reviewSchema.statics.getNurseRating = async function(nurseId) {
  const stats = await this.aggregate([
    { $match: { nurseId: new mongoose.Types.ObjectId(nurseId) }},
    { 
      $group: {
        _id: "$nurseId",
        averageRating: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);
  return stats[0] || { averageRating: 0, numberOfReviews: 0 };
};

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;