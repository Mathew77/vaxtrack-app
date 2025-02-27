import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const stats = [
  {
    percentage: 48,
    value: 38566,
    label: "Number of EHFs that reported at least one antigen below minimum stock level",
    color: "#FF9800", // Orange
    background: "#FFF3E0", // Light Orange
    textColor: "#5D4037", // Dark Brown for contrast
  },
  {
    percentage: 75,
    value: 55566,
    label: "Number of EHFs that reported at least one antigen below minimum stock level",
    color: "#4CAF50", // Green
    background: "#E8F5E9", // Light Green
    textColor: "#1B5E20", // Dark Green for contrast
  },
];


const CCE: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {stats.map((item, index) => (
        <Grid item xs={12} key={index}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              padding: 3,
              backgroundColor: item.background,
              color: "white",
              minHeight: 120,
            }}
          >
            <Box sx={{ width: 80, height: 80, marginRight: 3 }}>
              <CircularProgressbar
                value={item.percentage}
                text={`${item.percentage}%`}
                styles={buildStyles({
                  pathColor: item.color,
                  textColor: "white",
                  trailColor: "rgba(192, 9, 9, 0.2)",
                })}
              />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: item.textColor }}>
                {item.value.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, color: item.textColor }}>
                {item.label}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CCE;
