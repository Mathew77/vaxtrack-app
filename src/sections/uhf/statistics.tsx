import React from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GradingIcon from '@mui/icons-material/Grading';
import DeckIcon from '@mui/icons-material/Deck';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { useFetchUhfDashboard } from 'src/hooks/apis/dashboards/uhf/uhf-dashboard-hook';
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
        boxShadow: 3,
        borderRadius: 2,
        background: bgColor,
        color: textColor,
        height: '100%',
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
        {/* <Typography variant="body2" sx={{ position: 'absolute', top: 10, right: 15, fontWeight: 'bold' }}>
          {trend}
        </Typography> */}
        <div style={{ fontSize: 40, marginBottom: 8 }}>{icon}</div>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {total}
        </Typography>
      </CardContent>
    </Card>
  );
};


export default function VaccineOverview() {

  const { data, isLoading: isAllUhfStocks } = useFetchUhfDashboard();

  const isLoading = isAllUhfStocks;

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!data) {
    return (
      <Typography variant="body1" color="textSecondary">
        No data available
      </Typography>
    );
  }


  return (
    <Grid container spacing={2}>
      {[
        {
          title: 'Successful Deliveries Received for Fixed Sessions',
          total: (data?.total_fixed_sessions_delivered ?? 0).toString(),
          icon: <CheckCircleIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          textColor: '#0D47A1',
          // trend: '↗ +2.6%',
        },
        {
          title: 'Successful Reverse Logistics Completed Fixed Sessions',
          total: (data?.total_fixed_sessions_completed ?? 0).toString(),
          icon: <GradingIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          textColor: '#1B5E20',
          // trend: '↗ +1.2%',
        },
        {
          title: 'Successful Deliveries Received for Outreach Sessions',
          total: (data?.total_outreach_sessions_delivered ?? 0).toString(),
          icon: <DeckIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
          textColor: '#B71C1C',
          // trend: '↘ -0.8%',
        },
        {
          title: 'Successful Reverse Logistics Completed for Outreach Sessions',
          total: (data?.total_outreach_sessions_completed ?? 0).toString(),
          icon: <PublishedWithChangesIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          textColor: '#E65100',
          // trend: '↘ -1.5%',
        },
        {
          title: 'Number of Community Vaccine Conveyors engaged',
          total: (data?.total_threepl_count ?? 0).toString(),
          icon: <Diversity3Icon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
          textColor: '#01579B',
          // trend: '↗ +0.4%',
        },
      ].map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={2.4}>
          {/* 5 cards per row: 12 / 5 = 2.4 */}
          <VaccineCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
