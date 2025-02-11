import { useState } from "react";
import { DateRangePicker, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TimeRangeSlider from "./react"; // Adjust the path as needed

interface CalendarComponentProps {
  onDateSelect: (
    selectedRange: { startDate: Date; endDate: Date },
    startTime: Date,
    endTime: Date
  ) => void;
}

export default function CalendarComponent({ onDateSelect }: CalendarComponentProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of today

  const [range, setRange] = useState<Range[]>([
    {
      startDate: today,
      endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // Default: Next 7 days
      key: "selection",
    },
  ]);

  // Store times in "HH:mm" string format.
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("18:00");

  // Merge date with selected time (parses time strings like "10:00")
  const mergeDateWithTime = (date: Date | undefined, time: string): Date | null => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  // Handle date selection from the date range picker
  const handleDateSelect = (ranges: { [key: string]: Range }) => {
    const selectedRange = ranges.selection;
    if (!selectedRange.startDate || !selectedRange.endDate) return;

    // Prevent selecting past dates
    if (selectedRange.startDate < today) {
      selectedRange.startDate = today;
    }
    if (selectedRange.endDate < today) {
      selectedRange.endDate = today;
    }

    setRange([selectedRange]);

    const startDateTime = mergeDateWithTime(selectedRange.startDate, startTime);
    const endDateTime = mergeDateWithTime(selectedRange.endDate, endTime);

    if (startDateTime && endDateTime) {
      onDateSelect(
        { startDate: startDateTime, endDate: endDateTime },
        startDateTime,
        endDateTime
      );
    }
  };

  // Handle time changes coming from the TimeRangeSlider component
  const handleTimeChange = (time: string, type: "start" | "end") => {
    if (type === "start") {
      setStartTime(time);
      const updatedStartDate = mergeDateWithTime(range[0].startDate, time);
      if (updatedStartDate) {
        onDateSelect(
          { startDate: updatedStartDate, endDate: range[0].endDate as Date },
          updatedStartDate,
          mergeDateWithTime(range[0].endDate, endTime) as Date
        );
      }
    } else {
      setEndTime(time);
      const updatedEndDate = mergeDateWithTime(range[0].endDate, time);
      if (updatedEndDate) {
        onDateSelect(
          { startDate: range[0].startDate as Date, endDate: updatedEndDate },
          mergeDateWithTime(range[0].startDate, startTime) as Date,
          updatedEndDate
        );
      }
    }
  };

  return (
    <div className="pb-9 absolute right-0 z-20 mt-1 w-full  border border-black overflow-hidden rounded-md bg-white shadow-lg">
      {/* Date Range Picker */}
      <div className="md:w-5/6 md:left-20">
      <DateRangePicker
        ranges={range}
        onChange={handleDateSelect}
        months={2} // Show 2 months
        direction="horizontal"
        minDate={today} // Prevent past date selection
        moveRangeOnFirstSelection={false} // Prevents auto-merging of months
        preventSnapRefocus={true} // Stops auto-jumping
        staticRanges={[]} 
        inputRanges={[]}
      />
      </div>

      {/* Time Selection (Dual Slider) */}
      <TimeRangeSlider onTimeChange={handleTimeChange} />
    </div>
  );
}
