"use client";

import { useEffect, useRef, useState } from "react";

export default function ViewerPage() {
  const videoRef = useRef(null);
  const [webSocket, setWebSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setWebSocket(ws);

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.offer) {
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
          ],
        });

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            ws.send(JSON.stringify({ iceCandidate: event.candidate }));
          }
        };

        pc.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        ws.send(JSON.stringify({ answer }));
        setPeerConnection(pc);
      }

      if (message.iceCandidate) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      }
    };

    return () => {
      if (webSocket) webSocket.close();
      if (peerConnection) peerConnection.close();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Live Stream Viewer</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls={false}
        muted={false}
        style={{ width: "80%", borderRadius: "8px", backgroundColor: "#000" }}
      />
    </div>
  );
}
