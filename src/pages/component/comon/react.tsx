import React, { useState, useRef } from "react";

interface TimeRangeSliderProps {
  onTimeChange: (time: string, type: "start" | "end") => void;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({ onTimeChange }) => {
  const [startTime, setStartTime] = useState(780); // 13:00 (780 minutes)
  const [endTime, setEndTime] = useState(1020); // 17:00 (1020 minutes)
  const draggingRef = useRef<"start" | "end" | null>(null);

  const minutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault(); // Prevent text selection during drag
    if (!draggingRef.current) return;

    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const slider = (event.target as HTMLElement).closest(".slider-container");
    if (!slider) return;

    const { left, width } = slider.getBoundingClientRect();
    let newTime = Math.round(((clientX - left) / width) * 1440);
    newTime = Math.max(0, Math.min(1440, newTime));

    if (draggingRef.current === "start" && newTime < endTime - 15) {
      setStartTime(newTime);
      onTimeChange(minutesToTimeString(newTime), "start");
    } else if (draggingRef.current === "end" && newTime > startTime + 15) {
      setEndTime(newTime);
      onTimeChange(minutesToTimeString(newTime), "end");
    }
  };

  const handleMouseDown = (type: "start" | "end") => {
    draggingRef.current = type;
    document.addEventListener("mousemove", handleDrag as EventListener);
    document.addEventListener("mouseup", handleMouseUp as EventListener);
    document.addEventListener("touchmove", handleDrag as EventListener);
    document.addEventListener("touchend", handleMouseUp as EventListener);
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
    document.removeEventListener("mousemove", handleDrag as EventListener);
    document.removeEventListener("mouseup", handleMouseUp as EventListener);
    document.removeEventListener("touchmove", handleDrag as EventListener);
    document.removeEventListener("touchend", handleMouseUp as EventListener);
  };

  return (
    <div className="w-full p-4">
      <div className="relative w-full mb-8 slider-container">
        <label className="block text-gray-600 mb-1">Start Time</label>
        <div className="relative w-full">
          <div className="absolute top-1/2 left-0 h-1 bg-gray-300 w-full rounded-full" style={{ transform: "translateY(-50%)" }} />
          <div
            className="absolute top-1/2 bg-blue-500 h-1 rounded-full"
            style={{
              left: `${(startTime / 1440) * 100}%`,
              width: `${((endTime - startTime) / 1440) * 100}%`,
              transform: "translateY(-50%)",
            }}
          />
          <span
            className="absolute bg-white shadow-md border rounded-full px-3 py-1 text-blue-500 text-sm font-semibold cursor-pointer"
            style={{
              left: `calc(${(startTime / 1440) * 100}% - 20px)`,
              transform: "translateX(-50%)",
              top: "-30px",
            }}
            onMouseDown={() => handleMouseDown("start")}
            onTouchStart={() => handleMouseDown("start")}
          >
            {minutesToTimeString(startTime)}
          </span>
        </div>
      </div>

      <div className="relative w-full slider-container">
        <label className="block text-gray-600 mb-1">End Time</label>
        <div className="relative w-full">
          <div className="absolute top-1/2 left-0 h-1 bg-gray-300 w-full rounded-full" style={{ transform: "translateY(-50%)" }} />
          <div
            className="absolute top-1/2 bg-blue-500 h-1 rounded-full"
            style={{
              left: `${(startTime / 1440) * 100}%`,
              width: `${((endTime - startTime) / 1440) * 100}%`,
              transform: "translateY(-50%)",
            }}
          />
          <span
            className="absolute bg-white shadow-md border rounded-full px-3 py-1 text-blue-500 text-sm font-semibold cursor-pointer"
            style={{
              left: `calc(${(endTime / 1440) * 100}% - 20px)`,
              transform: "translateX(-50%)",
              top: "-30px",
            }}
            onMouseDown={() => handleMouseDown("end")}
            onTouchStart={() => handleMouseDown("end")}
          >
            {minutesToTimeString(endTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeRangeSlider;
