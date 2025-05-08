const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('Connected to WebSocket server');
};

socket.onmessage = (event) => {
  console.log('Received:', event.data);
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};
