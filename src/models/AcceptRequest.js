const mongoose = require("mongoose");

const acceptRequestSchema = new mongoose.Schema({
  nurse_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  request_id: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true }, 
  price: { type: Number, required: true },  
  message: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "in-progress", "waiting-confirmation", "completed"], 
    default: "pending" 
  }, 
  accepted_at: { type: Date, default: Date.now }, 
  waitingSince: { type: Date }
});

module.exports = mongoose.model("AcceptRequest", acceptRequestSchema);

