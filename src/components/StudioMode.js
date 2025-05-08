'use client'

import React, { useState, useRef } from "react";
import { parseBlob } from "music-metadata-browser";
import "./StudioMode.css";

export default function StudioMode() {
  const [logData, setLogData] = useState(Array(24).fill([]));
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const audioRefs = useRef([]);
  const [onAir, setOnAir] = useState(false);
  const mediaStreamRef = useRef(null);
  const videoRef = useRef(null);
  const [micLevel, setMicLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micSourceRef = useRef(null);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleOnAir = async () => {
    if (onAir) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      if(audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setMicLevel(0);
      setOnAir(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Mic volume
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        micSourceRef.current = source;

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setMicLevel(volume);
          if (onAir) requestAnimationFrame(updateVolume);
        };
        updateVolume();

        setOnAir(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }
  };

  const handleDrop = async (e, hour) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("audio/")) return;

    try {
      const metadata = await parseBlob(file);
      const title = metadata.common.title || file.name;
      const artist = metadata.common.artist || "Unknown Artist";
      const duration = metadata.format.duration || 0;
      const albumArt = metadata.common.picture ? metadata.common.picture[0].data : null;

      const updatedLog = [...logData];
      updatedLog[hour] = [
        ...updatedLog[hour],
        { title, artist, duration, albumArt, file }
      ];
      setLogData(updatedLog);
    } catch (err) {
      console.error("Metadata parse error:", err);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const playSong = (song, index) => {
    if (currentSongIndex !== null && audioRefs.current[currentSongIndex]) {
      audioRefs.current[currentSongIndex].pause();
      audioRefs.current[currentSongIndex].currentTime = 0;
    }

    const audioElement = new Audio(URL.createObjectURL(song.file));
    audioElement.play();
    setCurrentSongIndex(index);
    audioRefs.current[index] = audioElement;

    audioElement.onended = () => {
      const nextIndex = index + 1 < logData.flat().length ? index + 1 : index;
      if (logData.flat()[nextIndex]) {
        playSong(logData.flat()[nextIndex], nextIndex);
      }
    };
  };

  const pauseSong = () => {
    if (currentSongIndex !== null && audioRefs.current[currentSongIndex]) {
      audioRefs.current[currentSongIndex].pause();
    }
  };

  const stopSong = () => {
    if (currentSongIndex !== null && audioRefs.current[currentSongIndex]) {
      audioRefs.current[currentSongIndex].pause();
      audioRefs.current[currentSongIndex].currentTime = 0;
    }
  };

  const playAllSongs = () => {
    const songs = logData.flat();
    if (songs.length === 0) return;

    playSong(songs[0], 0);

    for (let i = 0; i < songs.length - 1; i++) {
      const nextSong = songs[i + 1];
      audioRefs.current[i].onended = () => {
        playSong(nextSong, i + 1);
      };
    }
  };

  const pauseAllSongs = () => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
    });
  };

  const stopAllSongs = () => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setCurrentSongIndex(null);
  };

  return (
    <div className="studio-container">

      {/* Master controls section */}
      <div className="master-controls">
        <button onClick={playAllSongs} className="master-play-button">Master Play</button>
        <button onClick={pauseAllSongs} className="master-pause-button">Master Pause</button>
        <button onClick={stopAllSongs} className="master-stop-button">Master Stop</button>
        <button
          onClick={toggleOnAir}
          className={`on-air-button ${onAir ? "active" : ""}`}
        >
          {onAir ? "ON AIR" : "ON AIR"}
        </button>
      </div>

      <div className="studio-layout">
        <aside className="studio-sidebar">
          <button className="nav-button">My Log</button>
          <button className="nav-button">Assets</button>
          <button className="nav-button">Settings</button>
        </aside>

        <main className="studio-main">
          <h2 className="log-title">Log Timeline</h2>
          <div className="log-grid">
            {logData.map((entries, hour) => (
              <div key={hour} className="log-hour">
                <div className="hour-label">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div
                  className="log-slot"
                  onDrop={(e) => handleDrop(e, hour)}
                  onDragOver={handleDragOver}
                >
                  {entries.length === 0 ? (
                    <span className="drop-hint">Drop audio file here</span>
                  ) : (
                    entries.map((entry, index) => (
                      <div key={index} className="song-meta">
                        {entry.albumArt && (
                          <img
                            src={`data:image/jpeg;base64,${Buffer.from(entry.albumArt).toString("base64")}`}
                            alt="Album Art"
                            className="album-art"
                          />
                        )}
                        <strong>{entry.title}</strong>
                        <div>{entry.artist}</div>
                        <div>{formatDuration(entry.duration)}</div>
                        <div className="song-controls">
                          <button onClick={() => playSong(entry, index)} className="play-button">▶️</button>
                          <button onClick={pauseSong} className="pause-button">⏸️</button>
                          <button onClick={stopSong} className="stop-button">⏹️</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ display: onAir ? "block" : "none", width: "240px", marginTop: "20px" }}
          />
        </main>
      </div>

      <audio />
    </div>
  );
}
