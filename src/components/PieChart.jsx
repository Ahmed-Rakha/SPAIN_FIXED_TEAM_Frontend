import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { red } from "@mui/material/colors";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomPieChart = ({ totalHandledCases }) => {
  // Initialize with all statuses active
  const statusTypes = [
    "preselección-vois",
    "cif bloqueado",
    "pdt sistema",
    "tramitado",
    "automation"
  ];

  const [activeLegends, setActiveLegends] = useState(new Set(statusTypes));

  // Prepare data for pie chart
  const statusCounts = statusTypes.reduce((acc, status) => {
    acc[status] = 0; // Initialize count for each status
    return acc;
  }, {});

  // Aggregate counts from totalHandledCases
  for (const [idCase, users] of Object.entries(totalHandledCases)) {
    for (const user of Object.keys(users)) {
      const statuses = users[user];
      for (const [status, count] of Object.entries(statuses)) {
        statusCounts[status] = (statusCounts[status] || 0) + count; // Accumulate counts
      }
    }
  }

  // Create data arrays for Pie Chart
  const labels = Object.keys(statusCounts);
  const data = {
    labels: labels,
    datasets: [{
      data: labels.map((label) => (activeLegends.has(label) ? statusCounts[label] : 0)), // Active counts
      backgroundColor: labels.map((label, index) => 
        activeLegends.has(label) ? ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF5733"][index] : "rgba(0,0,0,0.1)"
      ),
      hoverBackgroundColor: labels.map((_, index) => ["#005BB5", "#009D6B", "#D9A500", "#D66B2B", "#C70039"][index]),
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#fff",
          usePointStyle: true,
          pointStyle: "rectRounded",
          font: {
            size: 15,
            weight: "bold",
          },
          padding: 17,
          boxWidth: 10,
          boxHeight: 10,
          useBorderRadius: true,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const toggleLegend = (status) => {
    setActiveLegends((prev) => {
      const newLegends = new Set(prev);
      if (newLegends.has(status)) {
        newLegends.delete(status); // Toggle off
      } else {
        newLegends.add(status); // Toggle on
      }
      return newLegends;
    });
  };

  return (
    <Box display="flex">
      <Box width="95%" sx={{ height: "300px" }}>
        <Pie data={data} options={options} />
      </Box>
      <Box
        width="30%"
        maxHeight="300px"
        overflow="auto"
        sx={{ borderLeft: "1px solid #ccc", paddingLeft: 2 }}
      >
        {statusTypes.map((status) => (
          <Box
            key={status}
            onClick={() => toggleLegend(status)}
            sx={{ cursor: "pointer", marginBottom: 1 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: activeLegends.has(status) ? red[800] : red[200],
                fontWeight: "bold",
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "4px 8px",
                width: "max-content",
                transition: "color 0.3s ease",
              }}
            >
              {status}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CustomPieChart;
