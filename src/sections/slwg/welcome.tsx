import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VaccinesIcon from '@mui/icons-material/Vaccines';



// Define the types for the props
interface CardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  bgColor: string;
  shadowColor: string;
}

const cardData: CardProps[] =[
  { title: 'Total EHF', value: 35, icon: <LocalHospitalIcon />, bgColor: '#3F51B5', shadowColor: 'rgba(63, 81, 181, 0.3)' },
  { title: 'Total UHF', value: 23, icon: <OpenInNewIcon />, bgColor: '#F57C00', shadowColor: 'rgba(245, 124, 0, 0.3)' },
  { title: 'Total LCCO', value: 5, icon: <AccountBalanceIcon />, bgColor: '#1976D2', shadowColor: 'rgba(25, 118, 210, 0.3)' },
  { title: 'Number of LCS that reported at least one CCE in Non-functional status', value: 12, icon: <VaccinesIcon />, bgColor: '#D81B60', shadowColor: 'rgba(216, 27, 96, 0.3)' }
];

const StyledCard: React.FC<CardProps> = ({ title, value, icon, bgColor, shadowColor }) => {
  return (
    <Card sx={{ p: 2, borderRadius: 1, boxShadow: 2, border: '1px solid #E0E0E0', textAlign: 'center', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
          height: 50,
          backgroundColor: bgColor,
          borderRadius: 2,
          boxShadow: `0px 10px 20px ${shadowColor}`,
          color: 'white',
          mx: 'auto',
          mb: 1
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
      {title === 'Total Vaccines' && (
        <Typography variant="body2" color="green">
          ↑ Distributed
        </Typography>
      )}
    </Card>
  );
};

const DashboardCards = () => {
  return (
    <Grid container spacing={3}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StyledCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
