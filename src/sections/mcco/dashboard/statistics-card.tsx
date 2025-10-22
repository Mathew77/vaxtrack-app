import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useFetchMccoIndicators } from 'src/hooks/apis/dashboards/mcco/mcco-dashboard-hook';
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
);

const VaccineCard: React.FC<VaccineCardProps> = ({ title, total, icon, bgColor, textColor, subtitle }) => {
  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: bgColor,
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
          p: 2.5,
          position: 'relative',
          height: '100%',
        }}
      >
        <Box sx={{ fontSize: 40, mb: 1, opacity: 0.9 }}>{icon}</Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
            {total}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              opacity: 0.95,
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {title}
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

export default function MccoStatisticsCard() {

  const { data, isLoading: isAllMccoIndicators} = useFetchMccoIndicators();

  const isLoading = isAllMccoIndicators;

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

  const cards = [
    {
      title: 'Total LMD Orders',
      total: data.totals?.total_lmd_orders_assigned?.toString() || '0',
      icon: <InventoryIcon fontSize="large" />,
      bgColor: '#0288D1',
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
      title: 'Reverse Logistics Completion',
      total: `${data.indicators.reverse_logistics_completion.percent.toFixed(1)}%`,
      subtitle: `${data.indicators.reverse_logistics_completion.completed_returns} of ${data.indicators.reverse_logistics_completion.expected_returns}`,
      icon: <AssignmentReturnIcon fontSize="large" />,
      bgColor: '#7B1FA2',
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
