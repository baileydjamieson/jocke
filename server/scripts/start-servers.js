const { exec } = require('child_process');

exec('node /server/chat-server/chatServer.js', (err, stdout, stderr) => {
  if (err) {
    console.error('Error starting WebSocket server:', err);
    return;
  }
  console.log(stdout);
});

exec('node /server/media-server/mediaServer.js', (err, stdout, stderr) => {
  if (err) {
    console.error('Error starting MediaSoup server:', err);
    return;
  }
  console.log(stdout);
});
