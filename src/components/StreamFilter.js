import React, { useState } from "react";

const genres = ["All", "Rock", "Pop", "Hip-hop", "Electronic", "Jazz", "Classical", "Reggae"];

const StreamFilter = ({ onSearch, onGenreChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    onGenreChange(genre);
  };

  return (
    <section className="stream-filter">
      <div className="search-bar">
        <input
  type="text"
  value={searchTerm}
  onChange={handleSearchChange}
  placeholder="Search stations..."
  className="search-input"
        />  
      </div>

      <div className="genre-filters">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreChange(genre)}
            className={`genre-button ${selectedGenre === genre ? "active" : ""}`}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
};

export default StreamFilter;
