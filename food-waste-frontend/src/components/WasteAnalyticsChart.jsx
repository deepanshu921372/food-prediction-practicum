import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const WasteAnalyticsChart = ({ data }) => {
  // Group data by food item (notes)
  const groupedData = {};
  const allDates = new Set();

  // First, collect all dates and group data by food item
  data.forEach(item => {
    const date = new Date(item.date).toISOString().split('T')[0];
    allDates.add(date);
    
    if (!groupedData[item.notes]) {
      groupedData[item.notes] = {};
    }
    groupedData[item.notes][date] = (item.foodWasted / item.foodPrepared) * 100;
  });

  // Create formatted data for the chart
  const chartData = Array.from(allDates).sort().map(date => {
    const dataPoint = { date };
    Object.keys(groupedData).forEach(foodItem => {
      dataPoint[foodItem] = groupedData[foodItem][date] ? 
        Number(groupedData[foodItem][date].toFixed(1)) : null;
    });
    return dataPoint;
  });

  // Enhanced color palette with gradients
  const colors = [
    { stroke: '#FF6B6B', fill: '#FF6B6B30' },
    { stroke: '#4ECDC4', fill: '#4ECDC430' },
    { stroke: '#45B7D1', fill: '#45B7D130' },
    { stroke: '#96CEB4', fill: '#96CEB430' },
    { stroke: '#FFEEAD', fill: '#FFEEAD30' },
    { stroke: '#D4A5A5', fill: '#D4A5A530' },
    { stroke: '#9B5DE5', fill: '#9B5DE530' },
    { stroke: '#F15BB5', fill: '#F15BB530' },
    { stroke: '#00BBF9', fill: '#00BBF930' },
    { stroke: '#00F5D4', fill: '#00F5D430' }
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Waste Trend Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and analyze food waste patterns over time
        </Typography>
      </Box>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e0e0e0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });
            }}
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <YAxis
            label={{ 
              value: 'Waste Percentage (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#666', fontSize: 13 }
            }}
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              padding: '10px'
            }}
            labelFormatter={(date) => {
              return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }}
            formatter={(value) => [`${value?.toFixed(1)}%`]}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{
              paddingBottom: '20px',
              fontSize: '13px'
            }}
          />
          {Object.keys(groupedData).map((foodItem, index) => (
            <Line
              key={foodItem}
              type="monotone"
              dataKey={foodItem}
              stroke={colors[index % colors.length].stroke}
              strokeWidth={2.5}
              dot={{ 
                r: 4, 
                strokeWidth: 2,
                fill: '#fff',
                stroke: colors[index % colors.length].stroke
              }}
              activeDot={{ 
                r: 6, 
                strokeWidth: 0,
                fill: colors[index % colors.length].stroke
              }}
              connectNulls
              fill={colors[index % colors.length].fill}
              fillOpacity={0.1}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default WasteAnalyticsChart; 