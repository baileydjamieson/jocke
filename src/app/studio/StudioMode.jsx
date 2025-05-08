import React from "react";
import { Button } from "../components/ui/button";
import { Mic, Video, Power } from "lucide-react";

export default function StudioMode() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="text-xl font-bold">Jocke Studio</div>
        <div className="flex gap-4 items-center">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Power size={18} /> ON AIR
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Mic size={16} /> Mic
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Video size={16} /> Cam
          </Button>
        </div>
      </header>

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
          <h2 className="text-lg font-semibold mb-4">Log Timeline</h2>
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
      </div>
    </div>
  );
}
