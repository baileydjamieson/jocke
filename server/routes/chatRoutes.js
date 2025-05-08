const express = require('express');
const router = express.Router();
const { chatController } = require('../chat-server/controllers/chatController');

router.post('/send-message', (req, res) => {
  const { message } = req.body;
  // Handle sending a message (via WebSocket, etc.)
  res.send({ status: 'Message sent' });
});

module.exports = router;
