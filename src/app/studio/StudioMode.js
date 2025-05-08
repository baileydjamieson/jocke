import React from "react";
import { Button } from "../components/ui/button";
import { Mic, Video, Power } from "lucide-react";

export default function StudioMode() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Top Bar */}

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 border-r border-zinc-800 p-4">
          <nav className="flex flex-col gap-4">
            <Button variant="ghost">My Log</Button>
            <Button variant="ghost">Assets</Button>
            <Button variant="ghost">Settings</Button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Playlist</h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Hourly rows go here */}
            {[...Array(24)].map((_, hour) => (
              <div
                key={hour}
                className="bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              >
                <div className="text-sm font-bold mb-2">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div className="flex gap-2">
                  {/* Song drop zones / entries go here */}
                  <div className="flex-1 h-16 bg-zinc-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <div className="preview-section">
          <div className="video-preview">
            <video id="video-preview" autoPlay muted playsInline />
          </div>
        <div className="audio-preview">
          <div id="mic-level-bar" style={{ width: '100%', height: '10px', background: '#555', borderRadius: '5px' }}>
          <div className="mic-meter-container">
            <div
              className="mic-meter"
              style={{ width: `${micLevel}%`, height: "10px", background: "limegreen" }}
            />
          </div>  
            <div id="mic-fill" style={{ width: '0%', height: '100%', background: '#4caf50', borderRadius: '5px' }}></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
