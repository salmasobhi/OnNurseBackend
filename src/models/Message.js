const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  acceptRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcceptRequest",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;