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
import { processData } from "../utils/helper";

const CustomGroupedBarChart = ({ totalHandledCases }) => {
  const dataBar = processData(totalHandledCases);
  
  // Log the processed data to check its structure
  console.log("Processed Data for BarChart:", dataBar);

  // Get unique status keys dynamically for the bar data keys
  const uniqueStatuses = [
    ...new Set(dataBar.flatMap((item) => Object.keys(item).filter((key) => key !== "idCase" && key !== "user" && key !== "dateProgress")))
  ];

  // Log the unique statuses
  console.log("Unique Statuses:", uniqueStatuses);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dataBar} barCategoryGap="20%" margin={{}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="user" // Set the X-axis to display users
          label={{
            value: "Usuario",
            position: "insideBottom",
            offset: 0,
            style: { fill: amber[900], fontWeight: "bold", fontSize: 16 },
          }}
          tick={{ fontSize: 12, fontWeight: "bold", fill: amber[500], dy: 3 }}
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
        {/* Create a separate bar for each status grouped by user */}
        {uniqueStatuses.map((status, index) => (
          <Bar
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
          {`User: ${payload[0].payload.user}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: indigo[500], fontWeight: "bold" }}
        >
          {`ID Case: ${payload[0].payload.idCase}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: indigo[400], fontWeight: "bold" }}
        >
          {`Date: ${payload[0].payload.dateProgress}`} {/* Display dateProgress */}
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
