import React, { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, subDays, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange) => void;
  initialRange?: DateRange;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  initialRange
}) => {
  // Predefined date range options
  const RANGE_OPTIONS = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Month', days: 30 }, // Simplified for this example
    { label: 'All Time', days: 365 * 10 } // Large range to represent all entries
  ];

  // State management
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    initialRange || {
      start: startOfDay(subDays(new Date(), 365)),
      end: endOfDay(new Date())
    }
  );

  // Effect to propagate date range changes
  useEffect(() => {
    onDateRangeChange(selectedRange);
  }, [selectedRange, onDateRangeChange]);

  // Handler for preset range selection
  const handlePresetSelect = (days: number) => {
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(end, days));
    setSelectedRange({ start, end });
  };

  // Manual date change handlers
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = startOfDay(new Date(e.target.value));
    setSelectedRange((prev) => ({
      ...prev,
      start: newStart
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = endOfDay(new Date(e.target.value));
    setSelectedRange((prev) => ({
      ...prev,
      end: newEnd
    }));
  };

  return (
    <div className='space-y-4'>
      <Card className=''>
        <CardHeader className='p-1'></CardHeader>
        <CardContent className='space-y-2 p-4'>
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => handlePresetSelect(option.days)}
              className='rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600 transition hover:bg-blue-100'
            >
              {option.label}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center space-x-2'>
          <label className='text-sm font-medium'>From:</label>
          <input
            type='date'
            value={format(selectedRange.start, 'yyyy-MM-dd')}
            onChange={handleStartDateChange}
            max={format(selectedRange.end, 'yyyy-MM-dd')}
            className='rounded border px-2 py-1 text-sm'
          />
        </div>

        <div className='flex items-center space-x-2'>
          <label className='text-sm font-medium'>To:</label>
          <input
            type='date'
            value={format(selectedRange.end, 'yyyy-MM-dd')}
            onChange={handleEndDateChange}
            min={format(selectedRange.start, 'yyyy-MM-dd')}
            className='rounded border px-2 py-1 text-sm'
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
