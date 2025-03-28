'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface TimeOfDayData {
  hour: number;
  count: number;
}

interface Props {
  data: TimeOfDayData[];
}

const TimeOfDayAnalysis: React.FC<Props> = ({ data }) => {
  // Transform data to include formatted time labels
  const formattedData = data.map((item) => ({
    ...item,
    timeLabel: formatHour(item.hour)
  }));

  // Custom tick formatter for X-axis
  const formatXAxis = (tickItem: number) => {
    return formatHour(tickItem);
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { hour, count, timeLabel } = payload[0].payload;
      return (
        <div className='rounded border bg-white p-4 shadow-lg'>
          <p className='font-bold'>{timeLabel}</p>
          <p>Entries: {count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className='p-4'>
        <h2 className='mb-4 text-center text-lg font-bold'>
          Time of Day Analysis
        </h2>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='hour' tickFormatter={formatXAxis} interval={0} />
            <YAxis
              label={{
                value: 'Number of Entries',
                angle: -90,
                position: 'insideLeft'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='count' fill='#82ca9d' name='Entries' />
          </BarChart>
        </ResponsiveContainer>
        <div className='mt-4 text-center text-sm text-gray-600'>
          Entries by Hour of the Day
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format hour
function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export default TimeOfDayAnalysis;
