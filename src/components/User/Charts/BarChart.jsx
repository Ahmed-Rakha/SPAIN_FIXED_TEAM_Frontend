import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { amber, indigo } from "@mui/material/colors";

// Helper function to format date (e.g., MM/DD/YYYY)
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US"); // Adjust locale if needed
};

// Function to process data for grouped bar chart
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

  const dataBar = Object.entries(groupedData).flatMap(([date, cases]) =>
    Object.entries(cases).map(([idCase, statusCounts]) => ({
      dateProgress: date,
      idCase,
      ...statusCounts,
    }))
  );

  return dataBar;
};

const CustomGroupedBarChart = ({ totalHandledCases }) => {
  const dataBar = processData(totalHandledCases);

  // Dynamically retrieve all unique status types for the chart
  const uniqueStatuses = [
    ...new Set(totalHandledCases.map((item) => item.status)),
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dataBar} barCategoryGap="20%"  margin={{   }} >
        <CartesianGrid strokeDasharray="0 0" />
        <XAxis
          dataKey="idCase"
          label={{
            value: "ID Caso",
            position: "insideBottom",
            offset: 0,
            style: { fill: amber[900], fontWeight: "bold", fontSize: 16,  },
          }}
          tick={{ fontSize: 12 , fontWeight: "bold", fill: amber[500],  dy: 3}}
        />
        <YAxis
          label={{
            value: "Conteo Total",
            angle: -90,
            position: "insideLeft",
            style: { fill: amber[900], fontWeight: "bold", fontSize: 16 },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="horizontal"
          verticalAlign="top"
          align="center"
          iconSize={10}
         
        />
        {/* Create a separate bar for each status (grouped by idCase) */}
        {uniqueStatuses.map((status, index) => (
          <Bar
            style={{ marginTop: 20 }}
            key={status}
            dataKey={status}
            fill={
              ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"][index % 5]
            }
            name={status}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "8px",
          boxShadow: 3,
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <Typography variant="h6" sx={{ color: "#333" }}>
          {`Date: ${payload[0].payload.dateProgress}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: indigo[500], fontWeight: "bold" }}
        >
          {`ID Case: ${payload[0].payload.idCase}`}
        </Typography>
        {payload.map((data) => (
          <Typography
            key={data.dataKey}
            variant="body2"
            sx={{ color: amber[900], fontWeight: "bold" }}
          >
            {`${data.dataKey}: ${data.value}`}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default CustomGroupedBarChart;