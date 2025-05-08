const WebSocket = require('ws');
const { chatController } = require('./controllers/chatController');
const { presenceController } = require('./controllers/presenceController');
const config = require('../config/serverConfig');

const wss = new WebSocket.Server({ port: config.chatPort });

wss.on('connection', (ws) => {
  console.log('A new user connected');
  
  // Set up event listeners
  ws.on('message', (message) => chatController.handleMessage(ws, message));
  ws.on('close', () => presenceController.handleDisconnect(ws));
});

console.log(`WebSocket Server running on ws://localhost:${config.chatPort}`);
