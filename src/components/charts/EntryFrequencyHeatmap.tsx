'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

interface HeatmapData {
  date: string;
  count: number;
}

interface Props {
  data: HeatmapData[];
}

const EntryFrequencyHeatmap: React.FC<Props> = ({ data }) => {
  // Transform data for Recharts
  const chartData = data.map((item) => ({
    date: format(parseISO(item.date), 'MM/dd'),
    count: item.count
  }));

  // Create a dynamic color gradient based on the data
  const getColor = (count: number) => {
    const maxCount = Math.max(...chartData.map((item) => item.count));
    const intensity = count / maxCount;

    // Create a gradient from soft blue to vibrant purple
    return `rgba(${Math.round(50 + 100 * intensity)}, ${Math.round(100 * (1 - intensity))}, ${Math.round(200 * intensity)}, 0.8)`;
  };

  return (
    <Card className=''>
      <CardHeader className='p-4'>
        <CardTitle className='text-center text-lg font-bold'>
          Entry Frequency Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2 p-4'>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis
              dataKey='date'
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={{ stroke: '#e0e0e0' }}
              className='text-sm'
            />
            <YAxis
              label={{
                value: 'Number of Entries',
                angle: -90,
                position: 'insideLeft',
                className: 'text-xs',
                offset: -10
              }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className='rounded-lg border bg-white p-3 shadow-xl'>
                      <p className='font-bold text-gray-700'>
                        Date: {payload[0].payload.date}
                      </p>
                      <p className='font-semibold text-blue-600'>
                        Entries: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey='count' maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.count)}
                  className='transition-all duration-300 hover:opacity-80'
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {chartData.length === 0 && (
          <div className='py-10 text-center text-gray-500'>
            No entry data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EntryFrequencyHeatmap;
