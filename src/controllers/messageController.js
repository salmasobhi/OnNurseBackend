const Message = require('../models/Message');
const AcceptRequest = require('../models/AcceptRequest');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { acceptRequestId, content, receiverId } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      acceptRequestId,
      senderId,
      receiverId,
      content
    });

    await message.save();
    
    // Emit message through Socket.IO
    req.app.get('io').to(acceptRequestId).emit('receive-message', {
      ...message.toJSON(),
      sender: {
        _id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const { acceptRequestId } = req.params;
    const userId = req.user.id;

    // Verify user is part of this chat
    const acceptRequest = await AcceptRequest.findById(acceptRequestId)
      .populate('request_id');
    
    if (!acceptRequest) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (![acceptRequest.nurse_id.toString(), acceptRequest.request_id.user_id.toString()].includes(userId)) {
      return res.status(403).json({ message: "Unauthorized to view this chat" });
    }

    const messages = await Message.find({ acceptRequestId })
      .populate('senderId', 'first_name last_name profile_picture')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { acceptRequestId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { 
        acceptRequestId,
        receiverId: userId,
        isRead: false
      },
      { isRead: true }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  markAsRead
};