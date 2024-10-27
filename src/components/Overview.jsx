import React from "react";
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Box,
  styled,
} from "@mui/material";

import CustomAreaChart from "./AreaChart";
import CustomPieChart from "./PieChart";
import CustomBarChart from "./BarChart";
import getHandledCasesByUsers from "../services/getHandledCasesByUsers";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./Spinners/LoadingSpinner";
import UnauthenticatedFallback from "./Auth/UnAuthenticated";
import { getHandledCasesByUsersApi } from "../services/getHandledCasesByUsersApi";
import { generateSummaryArrayForHandledCasesByUsers } from "../utils/helper";

const TypographyNumberStyled = styled(Typography)({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "white",
  textShadow:
    "1px 1px 2px rgba(0, 0, 0, 0.3), 0 0 25px rgba(0, 0, 0, 0.2), 0 0 5px rgba(0, 0, 0, 0.2)",
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
});

const TypographyTextStyled = styled(Typography)({
  mt: 1,
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: "rgba(255, 255, 255, 0.7)",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
  fontStyle: "italic",
  letterSpacing: "0.05em",
  width: "19rem",
  margin: "auto",
});
const Dashboard = () => {
  const {
    data: cases,
    isPending: isFetchingCases,
    isError,
    error,
  } = useQuery({
    queryKey: ["getCasesHandledByUsersApi"],
    queryFn: getHandledCasesByUsersApi,
  });
  console.log("cases", cases);

  if (isFetchingCases) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <UnauthenticatedFallback message={error.message} />;
  }

  const summaryArray = generateSummaryArrayForHandledCasesByUsers(cases);

  const now = new Date(); // Current date
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1); // Move to the start of tomorrow

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Total cases handled today based on unique `idCase`
  const totalCasesHandledToday = summaryArray.filter((item) => {
    const caseDate = new Date(item.dateProgress);
    return caseDate >= startOfToday && caseDate < startOfTomorrow;
  });

  const uniqueCasesHandledToday = new Set(
    totalCasesHandledToday.map((item) => item.idCase)
  ).size;

  // Calculate total cases handled per `idCase` by each user
  const casesByUserAndId = totalCasesHandledToday.reduce((acc, current) => {
    const { idCase, statusCounts, userName } = current;

    if (!acc[idCase]) acc[idCase] = {};
    if (!acc[idCase][userName]) acc[idCase][userName] = {};

    for (const [status, count] of Object.entries(statusCounts)) {
      acc[idCase][userName][status] =
        (acc[idCase][userName][status] || 0) + count;
    }

    return acc;
  }, {});

  console.log('casesByUserAndId', casesByUserAndId);
  
  const totalCasesHandledLastWeek = summaryArray.filter((item) => {
    const caseDate = new Date(item.dateProgress);
    return caseDate >= oneWeekAgo && caseDate < startOfToday;
  }).length;

  const totalCasesHandledLastMonth = summaryArray.filter((item) => {
    const caseDate = new Date(item.dateProgress);
    return caseDate >= oneMonthAgo && caseDate < startOfToday;
  }).length;

  return (
    <Box
      sx={{
        backgroundColor: "#141B2D",
        padding: "8px 10px 0 10px",
        height: "630px",
        minHeight: "50%",
        overflow: "auto",
        webkitOverflowScrolling: "touch",

        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
          backgroundColor: "#ddd",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "50%",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f9f9f9",
        },
        "&:hover::-webkit-scrollbar-thumb": {
          backgroundColor: "#9c27b0",
        },
        // border: "1px solid red",
      }}
    >
      {/* Header Row */}
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #6D5B99 30%, #BFB3D1 100%)",
              color: "white",
              transition: "transform 0.3s",
              height: "21vh",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              },
              borderRadius: "10px",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <TypographyNumberStyled variant="h5" component="div">
                {uniqueCasesHandledToday}
              </TypographyNumberStyled>
              <TypographyTextStyled variant="body2" sx={{ width: "18rem" }}>
                Total casos gestionados hoy
              </TypographyTextStyled>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #FF758C 30%, #FF7EB3 100%)",
              color: "white",
              transition: "transform 0.3s",
              height: "21vh",

              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              },
              borderRadius: "10px",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <TypographyNumberStyled variant="h5" component="div">
                {totalCasesHandledLastWeek}
              </TypographyNumberStyled>
              <TypographyTextStyled variant="body2" sx={{ mb: 1.5 }}>
                Total casos gestionados esta semana
              </TypographyTextStyled>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #6A82FB 30%, #FC5C7D 100%)",
              color: "white",
              transition: "transform 0.3s",
              height: "21vh",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              },
              borderRadius: "10px",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <TypographyNumberStyled variant="h5" component="div">
                {totalCasesHandledLastMonth}
              </TypographyNumberStyled>
              <TypographyTextStyled variant="body2" sx={{ mb: 1.5 }}>
                Total casos gestionados este mes
              </TypographyTextStyled>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Charts Section */}
      <Grid2 container spacing={2} sx={{ marginTop: 2 }}>
        {/* Pie Chart */}
        <Grid2 size={{ xs: 12, sm: 12 }}>
          <Card sx={{ backgroundColor: "#1F2A40", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Pie Chart</Typography>
            
              <CustomPieChart totalHandledCases={casesByUserAndId} />
            </CardContent>
          </Card>
        </Grid2>

        {/* Bar Chart */}
        <Grid2 size={{ xs: 12, sm: 12 }}>
          <Card sx={{ backgroundColor: "#1F2A40", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Bar Chart</Typography>
              <CustomBarChart totalHandledCases={casesByUserAndId} />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Line Chart */}
      <Grid2 container spacing={2} sx={{ marginTop: 2 }}>
        <Grid2 size={{ xs: 12 }}>
          <Card sx={{ backgroundColor: "#1F2A40", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Line Chart</Typography>
              <CustomAreaChart totalHandledCases={casesByUserAndId} />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
