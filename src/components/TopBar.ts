"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";
import StreamFilter from "../components/StreamFilter";

const stations = [
  { id: 1, name: "Kurt Vile", song: "Pretty Pimpin", listeners: 554, genre: "Rock" },
  { id: 2, name: "DJ Mia", song: "Feel the Beat", listeners: 392, genre: "Pop" },
  { id: 3, name: "Soulwax", song: "Heaven Scent", listeners: 267, genre: "Electronic" },
  { id: 4, name: "DJ Thunder", song: "Rock On!", listeners: 361, genre: "Rock" },
  { id: 5, name: "Sarah", song: "Heartbreaker", listeners: 196, genre: "Pop" },
  { id: 6, name: "DJ Smith", song: "Dancefloor Vibes", listeners: 112, genre: "Hip-hop" },
  { id: 7, name: "The Distillers", song: "City of Angels", listeners: 308, genre: "Rock" },
  { id: 8, name: "Chillwave", song: "Synth Dreams", listeners: 153, genre: "Electronic" },
  { id: 9, name: "Lucy Cohen", song: "Autumn Leaves", listeners: 92, genre: "Jazz" },
  { id: 10, name: "DJ Beatmaster", song: "Deep Bass", listeners: 471, genre: "Electronic" },
  { id: 11, name: "DJ Echo", song: "Smooth Jazz", listeners: 194, genre: "Jazz" },
  { id: 12, name: "Cool Reggae", song: "Roots Groove", listeners: 118, genre: "Reggae" },
];

const HomePage = () => {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const filteredStations = stations
    .filter((station) => selectedGenre === "All" || station.genre === selectedGenre)
    .filter((station) => station.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <main className="home-page">
      <Navbar />

      <StreamFilter onSearch={setSearchTerm} onGenreChange={setSelectedGenre} />

      <section className="hero">
        <h1>Jocke</h1>
        {isLoggedIn ? (
          <Link href="/studio" className="cta-button">
            Go to Studio
          </Link>
        ) : (
          <Link href="/login" className="cta-button">
            Log in to Stream
          </Link>
        )}
      </section>

      <section className="stream-grid">
        {filteredStations.length === 0 ? (
          <p>No stations found. Try changing the filters!</p>
        ) : (
          filteredStations.map((station) => (
            <div key={station.id} className="station-card">
              <div className="station-info">
                <h3>{station.name}</h3>
                <p>{station.song}</p>
                <p>Listeners: {station.listeners}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default HomePage;
