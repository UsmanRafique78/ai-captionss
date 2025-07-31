"use client";

import { saveAs } from "file-saver";
import toast from "react-hot-toast";

export default function DownloadSRTButton({ items, filename, children }) {
  if (!items || items.length === 0) return null;

  const convertToSRT = (items) => {
    let srt = "";
    let index = 1;

    const formatTime = (timeInSec) => {
      const date = new Date(0);
      date.setSeconds(parseFloat(timeInSec));
      return date.toISOString().substr(11, 12).replace(".", ",");
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type === "pronunciation") {
        const start = formatTime(item.start_time);
        const end = formatTime(item.end_time);
        const text = item.alternatives[0].content;
        srt += `${index++}\n${start} --> ${end}\n${text}\n\n`;
      }
    }

    return srt;
  };

  const handleDownload = () => {
    try {
      const srtText = convertToSRT(items);
      const blob = new Blob([srtText], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `${filename || "subtitles"}.srt`);
      toast.success("SRT downloaded successfully!");
    } catch (error) {
      console.error("Error generating SRT:", error);
      toast.error("Failed to download SRT.");
    }
  };

  return <span onClick={handleDownload}>{children}</span>;
}
