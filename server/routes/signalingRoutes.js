const express = require('express');
const router = express.Router();
const { signalingController } = require('../media-server/controllers/signalingController');

router.post('/create-transport', (req, res) => {
  const { ws } = req.body;
  signalingController.createTransport(ws);
  res.send({ status: 'Transport created' });
});

module.exports = router;
