module.exports.chatController = {
  handleMessage: (ws, message) => {
    console.log(`Received message: ${message}`);
    // Broadcast message to all users
    
    ws.send(`Server received: ${message}`);
  }
};
