import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { amber, indigo } from '@mui/material/colors';

// Function to process data for line chart
const processData = (casesByUserAndId) => {
  const groupedData = {};

  Object.entries(casesByUserAndId).forEach(([idCase, users]) => {
    Object.entries(users).forEach(([user, statuses]) => {
      Object.entries(statuses).forEach(([status, count]) => {
        // Create a unique key for each entry based on idCase and user
        const key = `${idCase}-${user}`;
        if (!groupedData[key]) {
          groupedData[key] = {
            idCase,
            user,
            [status]: count // Initialize the status count
          };
        } else {
          groupedData[key][status] = (groupedData[key][status] || 0) + count; // Accumulate status counts
        }
      });
    });
  });

  // Convert the grouped data back to an array format
  return Object.values(groupedData);
};

const CustomLineChart = ({ totalHandledCases }) => {
  const dataArea = processData(totalHandledCases);

  // Dynamically retrieve all unique status types for the chart
  const uniqueStatuses = [
    ...new Set(dataArea.flatMap(item => Object.keys(item).slice(2))) // Ignore idCase and user
  ];

  console.log('Data Area:', dataArea); // Debugging: log data area
  console.log('Unique Statuses:', uniqueStatuses); // Debugging: log unique statuses

  if (dataArea.length === 0) {
    return <Typography>No data available for the chart.</Typography>; // Handle empty data case
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dataArea} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="user" // Set the dataKey to "user"
          label={{
            value: "Usuarios",
            position: "insideBottom",
            offset: 0,
            style: { fill: amber[900], fontWeight: 'bold', fontSize: 16 },
          }}
          tick={{ fontSize: 12, fontWeight: 'bold', fill: amber[500], dy: 3 }}
          interval={0} // Display all users without skipping
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
        {/* Create a separate line for each status (grouped by user) */}
        {uniqueStatuses.map((status, index) => (
          <Line
            key={status}
            type="monotone"
            dataKey={status}
            stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"][index % 5]}
            dot={false} // Set to true if you want to show dots on the line
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Custom tooltip for the line chart
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
          {`ID Caso: ${payload[0].payload.idCase}`}
        </Typography>
        <Typography variant="body2" sx={{ color: indigo[500], fontWeight: 'bold' }}>
          {`Usuario: ${payload[0].payload.user}`}
        </Typography>
        {payload.map((data) => (
          <Typography key={data.dataKey} variant="body2" sx={{ color: amber[900], fontWeight: 'bold' }}>
            {`${data.dataKey}: ${data.value}`}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default CustomLineChart;
