"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <header className="navbar">

      <nav>
        <Link href="/browse">Browse</Link>
        <Link href="/my-stations">My Stations</Link>

        {isAuthenticated ? (
          <Link href="/profile">Profile</Link>
        ) : (
          <>
            <Link href="/login">
              <button className="auth-btn">Log In</button>
            </Link>
            <Link href="/register">
              <button className="auth-btn">Sign Up</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
