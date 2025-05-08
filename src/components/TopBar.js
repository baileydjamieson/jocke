"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const TopBar = ({ isLoggedIn }) => {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <Link href="/" className="site-logo"></Link>
      </div>

      <div className="top-bar-right">
        {isLoggedIn ? (
          <div className="user-profile">
          <img src="/path-to-avatar.jpg" alt="Avatar" className="avatar" width="36" height="36" />
          <div className="dropdown">
            <button className="dropdown-toggle">▼</button>
            <ul className="dropdown-menu">
              <li><a href="/my-station">My Station</a></li>
              <li><a href="/settings">Settings</a></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
        ) : (
          <div className="auth-buttons">
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
