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
  today.setHours(0, 0, 0, 0);


    // Update on window resize event

  const [range, setRange] = useState<Range[]>([
    {
      startDate: today,
      endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);

  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("18:00");

  const mergeDateWithTime = (date: Date | undefined, time: string): Date | null => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const handleDateSelect = (ranges: { [key: string]: Range }) => {
    const selectedRange = ranges.selection;
    if (!selectedRange.startDate || !selectedRange.endDate) return;

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
    <div className="pb-9 absolute right-0 z-20 mt-1 max-w-[920px] border border-gray-100 overflow-hidden rounded-md bg-white shadow-lg">
      {/* Date Range Picker */}
      <div>
        <DateRangePicker
          ranges={range}
          onChange={handleDateSelect}
          months={2}
          direction="horizontal"
          minDate={today}
          preventSnapRefocus={true}
          staticRanges={[]}
          inputRanges={[]}
          className="custom-date-range-picker w-full sm:w-4/6 md:w-3/6 lg:w-2/6 mx-auto"
        />
      </div>

      {/* Time Selection (Dual Slider) */}
      <TimeRangeSlider onTimeChange={handleTimeChange} />
    </div>
  );
}
