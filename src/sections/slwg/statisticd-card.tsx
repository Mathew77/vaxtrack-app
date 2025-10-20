import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';

import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SystemSecurityUpdateWarningIcon from '@mui/icons-material/SystemSecurityUpdateWarning';
import { useFetchSlwgSummary } from 'src/hooks/apis/dashboards/slwg/slwg-dashboard-hook';
import { DashboardContent } from 'src/layouts/dashboard';
import Skeleton from '@mui/material/Skeleton';

interface VaccineCardProps {
  title: string;
  total: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  // trend: string;
}

const SkeletonLoader = () => (
  <DashboardContent maxWidth="xl">
    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }} />
    
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Card sx={{ p: 3 }}>
            <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%' }} />
          </Card>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={6} lg={4}>
        <Skeleton variant="rectangular" height={300} />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Skeleton variant="rectangular" height={300} />
      </Grid>
    </Grid>
  </DashboardContent>
);

const VaccineCard: React.FC<VaccineCardProps> = ({ title, total, icon, bgColor, textColor }) => {
  return (
    <Card
      sx={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: 2,
        background: bgColor,
        color: textColor,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 3,
          position: 'relative',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            mb: 2,
          }}
        >
          <Box sx={{ fontSize: 28, display: 'flex', alignItems: 'center' }}>{icon}</Box>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              mb: 0.5,
              opacity: 0.95,
              fontSize: '0.875rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: '2rem',
            }}
          >
            {total}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function VaccineOverview() {

  const { data, isLoading: isAllSlwgStock, error } = useFetchSlwgSummary();

  const isLoading = isAllSlwgStock;

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    console.error('SLWG Summary Error:', error);
    return (
      <Typography variant="body1" color="error">
        Error loading data: {error.message}
      </Typography>
    );
  }

  if (!data) {
    console.log('SLWG Summary - No data returned');
    console.log('SessionStorage slwg_list:', sessionStorage.getItem('slwg_list'));
    return (
      <Typography variant="body1" color="textSecondary">
        No data available
      </Typography>
    );
  }

  console.log('SLWG Summary Data:', data);

  return (
    <Grid container spacing={2}>
      {[
        {
          title: 'EHF LMD Order Received',
          total: (data.Total_EHF_LMD_Order_Received || 0).toString(),
          icon: <ReceiptLongIcon fontSize="large" />,
          bgColor: '#2E7D67',
          textColor: '#FFFFFF',
        },
        {
          title: 'EHF LMD Order Serviced',
          total: (data.Total_EHF_LMD_Order_Serviced || 0).toString(),
          icon: <RoomServiceIcon fontSize="large" />,
          bgColor: '#226192',
          textColor: '#FFFFFF',
        },
        {
          title: 'EHF LMD Order Serviced in Full',
          total: (data.Total_EHF_LMD_Order_Serviced_in_Full || 0).toString(),
          icon: <BatteryFullIcon fontSize="large" />,
          bgColor: '#90CAF9',
          textColor: '#1C252E',
        },
        {
          title: 'Total Vaccine Expired',
          total: (data.Total_Vaccine_expired || 0).toString(),
          icon: <SystemSecurityUpdateWarningIcon fontSize="large" />,
          bgColor: '#E8753A',
          textColor: '#FFFFFF',
        },

      ].map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          {/* 5 cards per row: 12 / 5 = 2.4 */}
          <VaccineCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
