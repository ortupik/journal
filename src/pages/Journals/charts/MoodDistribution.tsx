"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FC } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Define colors for sentiment categories
const COLORS = {
  Positive: "#4CAF50",
  Neutral: "#FFEB3B",
  Negative: "#F44336",
};

// Define props type
interface MoodDistributionProps {
  data: Record<string, number>;
}

const MoodDistribution: FC<MoodDistributionProps> = ({ data }) => {
  // Transform data into recharts-compatible format
  const chartData = Object.entries(data).map(([sentiment, count]) => ({
    name: sentiment,
    value: count,
  }));

  if (chartData.length === 0) {
    return <p className="text-gray-500 text-center">No mood data available.</p>;
  }

  return (
    <Card className="">
      <CardHeader className=" p-4">
        <CardTitle className="text-lg text-center font-bold">
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      </CardContent>
      </Card>
  );
};

export default MoodDistribution;
