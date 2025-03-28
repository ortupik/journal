"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { category: string; avgWords: number }[];
}

const AvgEntryLength = ({ data }: Props) => {
  // Dynamic color generation based on average words
  const getColor = (avgWords: number) => {
    const maxWords = Math.max(...data.map(item => item.avgWords));
    const intensity = avgWords / maxWords;
    
    // Gradient from soft teal to deep indigo
    return `rgba(${Math.round(50 + 100 * intensity)}, ${Math.round(150 * (1 - intensity))}, ${Math.round(200 * intensity)}, 0.8)`;
  };

  return (
    <Card className="">
      <CardHeader className=" p-4">
        <CardTitle className="text-center font-bold">
          Average Entry Length by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
            />
            <XAxis 
              dataKey="category" 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={{ stroke: '#e0e0e0' }}
              className="text-sm"
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
                    <div className="bg-white p-3 border rounded-lg shadow-xl">
                      <p className="font-bold text-gray-700">
                        Category: {payload[0].payload.category}
                      </p>
                      <p className="text-indigo-600 font-semibold">
                        Avg. Words: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="avgWords" 
              maxBarSize={50}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.avgWords)}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {data.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No category data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvgEntryLength;