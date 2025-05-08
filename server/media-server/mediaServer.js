const mediasoup = require('mediasoup');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let worker;
let router;
let transport;

async function startMediaServer() {
  worker = await mediasoup.createWorker();

  worker.on('died', () => {
    console.error('MediaSoup worker died');
    process.exit(1);
  });

  router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2
      },
      {
        kind: 'video',
        mimeType: 'video/vp8',
        clockRate: 90000
      }
    ]
  });
  
  console.log('MediaSoup Worker and Router created');
}

io.on('connection', (socket) => {
  console.log('User connected to MediaSoup signaling server');
  
  // Handle events like "createTransport", "connectTransport", etc.
  socket.on('createTransport', async (data, callback) => {
    transport = await router.createWebRtcTransport({
      listenIps: ['0.0.0.0'],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true
    });

    console.log('WebRTC transport created');
    callback({ transportOptions: transport.options });
  });

  socket.on('connectTransport', (data, callback) => {
    transport.connect({ dtlsParameters: data.dtlsParameters });
    callback();
  });

  socket.on('produce', async (data, callback) => {
    const producer = await transport.produce({
      kind: data.kind,
      rtpParameters: data.rtpParameters,
    });

    console.log('Produced stream:', producer.id);
    callback({ id: producer.id });
  });

  // Handle other signaling events (e.g., close, pause, etc.)
});

startMediaServer().then(() => {
  server.listen(3000, () => {
    console.log('MediaSoup signaling server running on http://localhost:3000');
  });
});
