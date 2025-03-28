"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils"; // Assuming you have a utility for date formatting

interface Props {
  data: { date: string; words: number }[];
}

const WordCountTrends = ({ data }: Props) => {
  // Calculate additional insights
  const totalWords = data.reduce((sum, entry) => sum + entry.words, 0);
  const averageWordCount = totalWords / data.length || 0;
  const maxWordCount = Math.max(...data.map(entry => entry.words));
  const minWordCount = Math.min(...data.map(entry => entry.words));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-bold mb-4 text-center">Word Count Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Words</p>
            <p className="font-bold">{totalWords.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Words/Entry</p>
            <p className="font-bold">{averageWordCount.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Peak Entry</p>
            <p className="font-bold">{maxWordCount}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => formatDate(value, 'MMM dd')}
              interval="preserveStartEnd"
            />
            <YAxis label={{ value: 'Words', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              labelFormatter={(value) => formatDate(value, 'MMMM dd, yyyy')}
              formatter={(value) => [value, 'Words']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="words" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WordCountTrends;