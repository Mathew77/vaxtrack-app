import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import { useFetchLcsIndicators } from 'src/hooks/apis/dashboards/lcs/lcs-dashboard-hook';
import { DashboardContent } from 'src/layouts/dashboard';
import Skeleton from '@mui/material/Skeleton';

interface VaccineCardProps {
  title: string;
  total: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  subtitle?: string;
}

const SkeletonLoader = () => (
  <DashboardContent maxWidth="xl">
    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }} />

    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Card sx={{ p: 3 }}>
            <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%' }} />
          </Card>
        </Grid>
      ))}
    </Grid>
  </DashboardContent>
);

const VaccineCard: React.FC<VaccineCardProps> = ({ title, total, icon, bgColor, textColor, subtitle }) => {
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
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                opacity: 0.85,
                fontSize: '0.75rem',
                mt: 0.5,
                display: 'block',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default function VaccineOverview() {
  const { data, isLoading, error } = useFetchLcsIndicators();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    console.error('LCS Indicators Error:', error);
    return (
      <Typography variant="body1" color="error">
        Error loading data: {error.message}
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography variant="body1" color="textSecondary">
        No data available
      </Typography>
    );
  }

  const cards = [
    {
      title: 'Total EHFs',
      total: data.denominator_total_ehfs.toString(),
      icon: <BusinessIcon fontSize="large" />,
      bgColor: '#1976D2',
      textColor: '#FFFFFF',
    },
    {
      title: 'In Full Delivery Rate',
      total: `${data.indicators.in_full_delivery.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.in_full_delivery.numerator} of ${data.indicators.in_full_delivery.denominator}`,
      icon: <CheckCircleIcon fontSize="large" />,
      bgColor: '#2E7D67',
      textColor: '#FFFFFF',
    },
    {
      title: 'On Time Delivery Rate',
      total: `${data.indicators.on_time_delivery.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.on_time_delivery.numerator} of ${data.indicators.on_time_delivery.denominator}`,
      icon: <AccessTimeIcon fontSize="large" />,
      bgColor: '#226192',
      textColor: '#FFFFFF',
    },
    {
      title: 'Stock Out Rate',
      total: `${data.indicators.stock_out_rate.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.stock_out_rate.numerator} of ${data.indicators.stock_out_rate.denominator}`,
      icon: <WarningAmberIcon fontSize="large" />,
      bgColor: '#E8753A',
      textColor: '#FFFFFF',
    },
    {
      title: 'Reorder Level Status',
      total: `${data.indicators.reorder_level_status.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.reorder_level_status.numerator} of ${data.indicators.reorder_level_status.denominator}`,
      icon: <TrendingDownIcon fontSize="large" />,
      bgColor: '#F57C00',
      textColor: '#FFFFFF',
    },
    {
      title: 'CCE Functionality Rate',
      total: `${data.indicators.cce_functionality_rate.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.cce_functionality_rate.numerator} of ${data.indicators.cce_functionality_rate.denominator}`,
      icon: <KitchenIcon fontSize="large" />,
      bgColor: '#388E3C',
      textColor: '#FFFFFF',
    },
    {
      title: 'Reverse Logistics Completion',
      total: `${data.indicators.reverse_logistics_completion.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.reverse_logistics_completion.completed_returns} of ${data.indicators.reverse_logistics_completion.expected_returns}`,
      icon: <AssignmentReturnIcon fontSize="large" />,
      bgColor: '#7B1FA2',
      textColor: '#FFFFFF',
    },
    {
      title: 'Stock Adequate Per Facility',
      total: `${data.indicators.stock_adequate_per_facility.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.stock_adequate_per_facility.numerator} of ${data.indicators.stock_adequate_per_facility.denominator}`,
      icon: <InventoryIcon fontSize="large" />,
      bgColor: '#0288D1',
      textColor: '#FFFFFF',
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <VaccineCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
