import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const stats = [
  { count: 6, label: "Antigens in VVM2", icon: <FolderIcon />, color: "#FFD590" },
  { count: 3, label: "Antigens with less than 6 months RSL", icon: <CheckCircleIcon />, color: "#C3E6C3" },
 
];

const progressStats = [
  { percentage: 73.9, value: 38566, label: "Minimum Stock Level", color: "#4CAF50" },
  { percentage: 45.6, value: 18472, label: "Maximum Stock Level", color: "#FFC107" },
];

const DashboardCards: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {[...stats, ...progressStats].map((item, index) => (
        <Grid item xs={12} sm={3} key={index}>
          <Card elevation={2} sx={{ borderRadius: 3, display: "flex", alignItems: "center", padding: 2, height: 120 }}>
            {"percentage" in item ? (
              <>
                <Box sx={{ width: 60, height: 60, marginRight: 2, display: "flex", alignItems: "center" }}>
                  <CircularProgressbar
                    value={item.percentage}
                    text={`${item.percentage}%`}
                    styles={buildStyles({
                      pathColor: item.color,
                      textColor: "#333",
                      trailColor: "#eee",
                    })}
                  />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {item.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h4" sx={{ fontWeight: "bold", marginRight: 2 }}>
                  {item.count}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: item.color,
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>
              </>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;