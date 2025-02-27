import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CCE: React.FC = () => {
  const totalTours = 186;
  const soldOut = 120;
  const available = 66;
  const percentage = (soldOut / totalTours) * 100;

  return (
    <Card elevation={2} sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Number of Community Vaccine Conveyors engaged
        </Typography>
        <Box sx={{ width: 180, height: 120, mx: "auto", mb: 2 }}>
          <CircularProgressbar
            value={percentage}
            text={totalTours.toString()}
            styles={buildStyles({
              pathColor: "#4CAF50",
              textColor: "#000",
              trailColor: "#F5F5F5",
              strokeLinecap: "round",
            })}
          />
        </Box>
        <Typography variant="body2" color="textSecondary">
          Cummunity
        </Typography>
        
        
      </CardContent>
    </Card>
  );
};

export default CCE;
