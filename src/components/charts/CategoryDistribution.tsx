'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  data: Record<string, number>;
}

const COLORS = [
  '#8884d8', // Purple
  '#82ca9d', // Green
  '#ffc658', // Yellow
  '#ff7f50', // Coral
  '#20b2aa', // Light Sea Green
  '#da70d6' // Orchid
];

const CategoryDistribution = ({ data }: Props) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value
  }));

  // Custom label renderer
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={12}
        fontWeight='bold'
      >
        {`${chartData[index].name}\n${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardContent className='p-4'>
        <h2 className='mb-4 text-center text-lg font-bold'>
          Category Distribution
        </h2>
        <ResponsiveContainer width='100%' height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} entries`,
                props.payload.name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='mt-4 flex flex-wrap justify-center gap-2'>
          {chartData.map((entry, index) => (
            <div key={entry.name} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded-full'
                style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }}
              />
              <span className='text-sm'>
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
