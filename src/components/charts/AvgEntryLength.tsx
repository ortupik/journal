'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  data: { category: string; avgWords: number }[];
}

const AvgEntryLength = ({ data }: Props) => {
  // Dynamic color generation based on average words
  const getColor = (avgWords: number) => {
    const maxWords = Math.max(...data.map((item) => item.avgWords));
    const intensity = avgWords / maxWords;

    // Gradient from soft teal to deep indigo
    return `rgba(${Math.round(50 + 100 * intensity)}, ${Math.round(150 * (1 - intensity))}, ${Math.round(200 * intensity)}, 0.8)`;
  };

  return (
    <Card className=''>
      <CardHeader className='p-4'>
        <CardTitle className='text-center font-bold'>
          Average Entry Length by Category
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2 p-4'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis
              dataKey='category'
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={{ stroke: '#e0e0e0' }}
              className='text-sm'
            />
            <YAxis
              label={{
                value: 'Avg. Words',
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
                        Category: {payload[0].payload.category}
                      </p>
                      <p className='font-semibold text-indigo-600'>
                        Avg. Words: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey='avgWords' maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.avgWords)}
                  className='transition-all duration-300 hover:opacity-80'
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {data.length === 0 && (
          <div className='py-10 text-center text-gray-500'>
            No category data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvgEntryLength;
