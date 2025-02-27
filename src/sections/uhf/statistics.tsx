import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

interface VaccineCardProps {
  title: string;
  total: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  //trend: string;
  smalltext: string;
}

const VaccineCard: React.FC<VaccineCardProps> = ({ title, total, icon, bgColor, textColor, smalltext}) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, background: bgColor, color: textColor }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 3,
          position: 'relative',
        }}
      >
        {/* <Typography variant="body2" sx={{ position: 'absolute', top: 10, right: 15, fontWeight: 'bold' }}>
          {trend}
        </Typography> */}
        <Box sx={{ fontSize: 40, mb: 1 }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {total}
        </Typography>
        <Typography variant="body2" >
          {smalltext}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function VaccineOverview() {
  return (
    <Grid container spacing={3}>
      {/* Total Vaccines */}
      <Grid item xs={12} sm={4}>
        <VaccineCard
          title="Number of  forward (Pick-and-drop)"
          total="1.2M"
          icon={<VaccinesIcon fontSize="large" />}
          bgColor="linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)"
          textColor="#0D47A1"
          // trend="↗ +2.6%"
          smalltext=" logistics completed"
        />
      </Grid>

      {/* Vaccines Distributed */}
      <Grid item xs={12} sm={4}>
        <VaccineCard
          title="Number of  reverse (Pick-and-drop) "
          total="950K"
          icon={<LocalShippingIcon fontSize="large" />}
          bgColor="linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)"
          textColor="#1B5E20"
          //trend="↗ +1.2%"
          smalltext=" logistics completed"
        />
      </Grid>

      {/* Pending Vaccine Requests */}
      <Grid item xs={12} sm={4}>
        <VaccineCard
          title="Total Vaccines"
          total="120K"
          icon={<PendingActionsIcon fontSize="large" />}
          bgColor="linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)"
          textColor="#B71C1C"
          //trend="↘ -0.8%"
          smalltext="Distrubuted"
        />
      </Grid>
    </Grid>
  );
}
