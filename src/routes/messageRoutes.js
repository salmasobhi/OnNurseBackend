const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  sendMessage,
  getChatHistory,
  markAsRead
} = require('../controllers/messageController');

router.post('/', auth, sendMessage);
router.get('/:acceptRequestId', auth, getChatHistory);
router.put('/:acceptRequestId/read', auth, markAsRead);

module.exports = router;