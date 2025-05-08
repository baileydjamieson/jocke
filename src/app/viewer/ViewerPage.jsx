"use client";

import { useEffect, useRef, useState } from "react";

export default function ViewerPage({ params }) {
  const { stationId } = params;
  const videoRef = useRef(null);
  const [ws, setWs] = useState(null);
  const [pc, setPc] = useState(null);

  useEffect(() => {
    const wsConnection = new WebSocket("ws://localhost:8080");

    wsConnection.onopen = () => {
      console.log("WebSocket connected");
      wsConnection.send(JSON.stringify({ type: "viewer", stationId }));
    };

    wsConnection.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "offer") {
        const peer = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        peer.onicecandidate = () => {};

        peer.ontrack = (e) => {
          if (videoRef.current) {
            videoRef.current.srcObject = e.streams[0];
          }
        };

        await peer.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        console.log("Sending answer.", answer); //Add log here
        wsConnection.send(JSON.stringify({
          type: "answer",
          answer: peer.localDescription,
          stationId,
        }));

        setPc(peer);
      }

      if (message.type === "iceCandidate" && pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      }
    };

    setWs(wsConnection);

    return () => {
      if (pc) pc.close();
      if (wsConnection) wsConnection.close();
    };
  }, [stationId, pc]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">Now Watching: {stationId}</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls
        muted={false}
        className="w-full max-w-4xl rounded shadow-lg"
      />
    </div>
  );
}
