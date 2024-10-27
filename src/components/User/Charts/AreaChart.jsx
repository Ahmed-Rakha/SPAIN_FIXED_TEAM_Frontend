import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { amber, indigo } from '@mui/material/colors';

// Helper function to format date (e.g., MM/DD/YYYY)
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US'); // Adjust locale if needed
};

// Function to process data for area chart
const processData = (totalHandledCases) => {
  const groupedData = {};

  totalHandledCases.forEach((item) => {
    const { dateProgress, idCase, status } = item;
    const formattedDate = formatDate(dateProgress); // Format the date

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {};
    }
    if (!groupedData[formattedDate][idCase]) {
      groupedData[formattedDate][idCase] = {};
    }

    groupedData[formattedDate][idCase][status] =
      (groupedData[formattedDate][idCase][status] || 0) + 1;
  });

  // Prepare data for the area chart
  const dataArea = Object.entries(groupedData).flatMap(([date, cases]) =>
    Object.entries(cases).map(([idCase, statusCounts]) => ({
      dateProgress: date,
      idCase,
      ...statusCounts,
    }))
  );

  return dataArea;
};

const CustomAreaChart = ({ totalHandledCases }) => {
  const dataArea = processData(totalHandledCases);

  // Dynamically retrieve all unique status types for the chart
  const uniqueStatuses = [
    ...new Set(totalHandledCases.map((item) => item.status)),
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={dataArea} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {uniqueStatuses.map((status, index) => (
            <linearGradient key={status} id={`color${status}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"][index % 5]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"][index % 5]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="idCase"
          label={{
            value: "ID Caso",
            position: "insideBottom",
            offset: 0,
            style: { fill: amber[900], fontWeight: 'bold', fontSize: 16 },
          }}
          tick={{ fontSize: 12, fontWeight: 'bold', fill: amber[500], dy: 3 }}
        />
        <YAxis
          label={{
            value: "Conteo Total",
            angle: -90,
            position: "insideLeft",
            style: { fill: amber[900], fontWeight: 'bold', fontSize: 16 },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        {/* Create a separate area for each status (grouped by idCase) */}
        {uniqueStatuses.map((status, index) => (
          <Area
            key={status}
            type="monotone"
            dataKey={status}
            stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"][index % 5]}
            fill={`url(#color${status})`}
            fillOpacity={1}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Custom tooltip for the area chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    return (
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: '8px',
          boxShadow: 3,
          padding: '10px',
          border: '1px solid #ccc',
        }}
      >
        <Typography variant="h6" sx={{ color: '#333' }}>
          {`Fecha: ${payload[0].payload.dateProgress}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: indigo[500], fontWeight: 'bold' }}
        >
          {`ID Caso: ${payload[0].payload.idCase}`}
        </Typography>
        {payload.map((data) => (
          <Typography
            key={data.dataKey}
            variant="body2"
            sx={{ color: amber[900], fontWeight: 'bold' }}
          >
            {`${data.dataKey}: ${data.value}`}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default CustomAreaChart;