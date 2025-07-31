"use client";
import { useState } from "react";

export default function BrollInsertor({ onSubmitBrolls,onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedBrolls, setSelectedBrolls] = useState([]);

  const handleSearch = async () => {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${searchTerm}&per_page=8`,
      {
        headers: {
          Authorization: "dgP3p9TTlpH7jfBxcILGHUhz7fsijUGqw7ne4dTMbH4tD9QS4NRkS5kA",
        },
      }
    );
    const data = await res.json();
    setResults(data.videos);
  };

  const handleAddBroll = (video) => {
    setSelectedBrolls((prev) => [
      ...prev,
      {
        id: video.id,
        preview: video.video_files[0]?.link,
        start: "",
        end: "",
        fade_duration: 0.5,
        position: "fill",
      },
    ]);
    onEdit?.();
  };

  const handleRemove = (id) => {
    setSelectedBrolls((prev) => prev.filter((b) => b.id !== id));
    onEdit?.();
  };

  const handleChange = (id, key, value) => {
    setSelectedBrolls((prev) =>
      prev?.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
    onEdit?.();
  };

  const handleSubmit = () => {
    const payload = selectedBrolls?.map((b) => ({
      id: b.id,
  url: b.preview,           
  start_time: parseFloat(b.start),  
  end_time: parseFloat(b.end),       
  fade_duration: parseFloat(b.fade_duration),  
  position: b.position,     
    }));

    console.log("Submitting to parent:", payload);

    if (onSubmitBrolls) {
      onSubmitBrolls(payload);
    }

    setSelectedBrolls([]);
  };
const formatTime = (timeStr) => {
  const t = parseFloat(timeStr);
  if (isNaN(t)) return "—";
  const mins = Math.floor(t / 60);
  const secs = Math.floor(t % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

  return (
    <div className="space-y-10 p-6  text-black rounded-xl ">
      {/* 🔍 Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search B-rolls (e.g. nature, street, food)..."
          className="flex-1 rounded-lg px-4 py-2 bg-white-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold transition"
        >
          🔍 Search
        </button>
      </div>

      {/* 🔎 Search Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results?.map((video) => (
          <div
            key={video.id}
            className="relative rounded-lg overflow-hidden shadow-md group"
          >
            <video
              src={video.video_files[0]?.link}
              className="w-full h-32 object-cover"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => e.target.pause()}
            />
            <button
              onClick={() => handleAddBroll(video)}
              className="absolute inset-x-0 bottom-0 bg-white/60 text-black text-sm py-1 text-center opacity-0 group-hover:opacity-100 transition"
            >
              ➕ Add B-roll
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Selected B-rolls */}
      {selectedBrolls.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black">Selected B-rolls</h2>

          {selectedBrolls?.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-lg p-4 shadow-md flex flex-col md:flex-row gap-4"
            >
              <video
                src={b.preview}
                className="w-full md:w-1/3 rounded-lg"
                muted
                loop
                playsInline
                controls
              />
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Start Time (s)"
                    className="bg-white-700 text-black px-3 py-2 rounded-lg"
                    value={b.start}
                    onChange={(e) => handleChange(b.id, "start", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="End Time (s)"
                    className="bg-white text-black px-3 py-2 rounded-lg"
                    value={b.end}
                    onChange={(e) => handleChange(b.id, "end", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="bg-white text-black px-3 py-2 rounded-lg"
                    value={b.position}
                    onChange={(e) => handleChange(b.id, "position", e.target.value)}
                  >
                    <option value="fill">Fill</option>
                    <option value="center">Center</option>
                  </select>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Fade Duration (s)"
                    className="bg-white text-black px-3 py-2 rounded-lg"
                    value={b.fade_duration}
                    onChange={(e) =>
                      handleChange(b.id, "fade_duration", e.target.value)
                    }
                  />
                </div>

                <button
                  onClick={() => handleRemove(b.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
{selectedBrolls.length > 0 && (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">🕓 B-roll Timeline</h3>
    <div className="space-y-2">
      {selectedBrolls?.map((b, i) => (
        <div
          key={b.id + "_summary"}
          className="bg-white text-sm text-black px-4 py-2 rounded-lg flex items-center justify-between"
        >
          <div>
            <strong>{formatTime(b.start)} → {formatTime(b.end)}</strong>
            <span className="ml-2 text-black">Video ID: {b.id}</span>
          </div>
          <video
            src={b.preview}
            className="w-24 h-14 object-cover rounded-md"
            muted
            loop
            playsInline
          />
        </div>
      ))}
    </div>
  </div>
)}

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              ✅ Submit B-rolls
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
