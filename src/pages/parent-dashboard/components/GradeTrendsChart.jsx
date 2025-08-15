import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const GradeTrendsChart = () => {
  const gradeData = [
    { month: 'Sep', Mathematics: 85, Science: 78, English: 92, History: 88 },
    { month: 'Oct', Mathematics: 88, Science: 82, English: 89, History: 85 },
    { month: 'Nov', Mathematics: 92, Science: 85, English: 94, History: 90 },
    { month: 'Dec', Mathematics: 89, Science: 88, English: 91, History: 87 },
    { month: 'Jan', Mathematics: 94, Science: 90, English: 96, History: 92 },
    { month: 'Feb', Mathematics: 91, Science: 87, English: 93, History: 89 },
    { month: 'Mar', Mathematics: 96, Science: 92, English: 98, History: 94 }
  ];

  const subjects = [
    { key: 'Mathematics', color: '#2563EB', name: 'Mathematics' },
    { key: 'Science', color: '#10B981', name: 'Science' },
    { key: 'English', color: '#F59E0B', name: 'English' },
    { key: 'History', color: '#EF4444', name: 'History' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-modal p-3">
          <p className="font-medium text-foreground mb-2">{`${label} 2024`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Grade Trends</h2>
        <div className="text-sm text-muted-foreground">Academic Year 2024-25</div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gradeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              domain={[70, 100]}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {subjects.map((subject) => (
              <Line
                key={subject.key}
                type="monotone"
                dataKey={subject.key}
                stroke={subject.color}
                strokeWidth={2}
                dot={{ fill: subject.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: subject.color, strokeWidth: 2 }}
                name={subject.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((subject) => {
          const latestGrade = gradeData[gradeData.length - 1][subject.key];
          const previousGrade = gradeData[gradeData.length - 2][subject.key];
          const trend = latestGrade - previousGrade;
          
          return (
            <div key={subject.key} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-foreground">{subject.name}</div>
              <div className="text-lg font-bold" style={{ color: subject.color }}>
                {latestGrade}%
              </div>
              <div className={`text-xs ${trend >= 0 ? 'text-success' : 'text-error'}`}>
                {trend >= 0 ? '+' : ''}{trend}% from last month
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradeTrendsChart;