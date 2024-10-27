import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Box, colors, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { red } from "@mui/material/colors";
import { Margin } from "@mui/icons-material";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomPieChart = ({ totalHandledCases }) => {
  // Initialize with all statuses active
  const statusTypes = [
    "Preselección-Vois",
    "CIF Bloqueado",
    "Pdt sistema",
    "Tramitado",
    "Automation"
  ];

  const [activeLegends, setActiveLegends] = useState(new Set(statusTypes));

  const casesGrandesGroupedByIdCase = new Set(totalHandledCases.map((item) => item.idCase));

  const myData = [...casesGrandesGroupedByIdCase].map((caseGrande) => {
    const statusCounts = totalHandledCases
      .filter((item) => item.idCase === caseGrande)
      .reduce((acc, item) => {
        const status = item.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
    return statusCounts;
  });

  const labels = [...casesGrandesGroupedByIdCase];

  const dataset = statusTypes.map((status) => {
    return myData.map((counts) => counts[status] || 0);
  });

  const data = {
    labels: labels,
    datasets: statusTypes.map((status, index) => ({
      label: status,
      data: dataset[index],
      backgroundColor: activeLegends.has(status)
        ? ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF5733"][index]
        : "rgba(0,0,0,0.1)", // Inactive color
      hoverBackgroundColor: ["#005BB5", "#009D6B", "#D9A500", "#D66B2B", "#C70039"][index],
    })),
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
          // pointStyle: "",
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
                color: activeLegends.has(status) ? red[800] : red[200], // Active vs Inactive color
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