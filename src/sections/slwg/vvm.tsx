import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const stats = [
  { percentage: 48, value: 38566, label: "Number of EHFs that reported at least one antigen in VVM2", color: "#2E7D67", background: "#2E7D67" },
  { percentage: 75, value: 55566, label: "Number of EHFs thst reported at least one antigen with less than 6months RSL", color: "#226192", background: "#226192" },
  
];

const CCE2: React.FC = () => {
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
                  trailColor: "rgba(255, 255, 255, 0.2)",
                })}
              />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {item.value.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {item.label}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CCE2;
