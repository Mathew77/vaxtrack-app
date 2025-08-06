import React from 'react';
import { Grid, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
//import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';
import { useFetchAntigenEhfStock } from 'src/hooks/apis/dashboards/ehf/ehf-dashboard-hook';

interface VaccineCardProps {
  title: string;
  total: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  // trend: string;
}

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
  const { data, isLoading, error } = useFetchAntigenEhfStock();

  if (!data) {
    return (
      <Alert severity="warning">
        No antigen stock data available
      </Alert>
    );
  }

  const cards = [
    {
      title: 'Antigens below minimum stock level',
      total: (data?.below_min_stock_count ?? 0).toString(),
      icon: <VaccinesIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      textColor: '#0D47A1',
      // trend: '↘ 2.6%', 
    },
    {
      title: 'Antigens out of stock',
      total: (data?.out_of_stock_count ?? 0).toString(),
      icon: <HourglassDisabledIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      textColor: '#1B5E20',
      // trend: '↘ 1.2%',
    },
    {
      title: 'Antigen/device mismatch',
      total: (data?.mismatch_count ?? 0).toString(),
      icon: <MoneyOffCsredIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
      textColor: '#B71C1C',
      // trend: '↘ 0.8%', 
    },
    {
      title: 'Antigens with less than 6 months RSL',
      total: (data?.less_than_6_months_rsl_count ?? 0).toString(),
      icon: <FormatColorFillIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
      textColor: '#E65100',
      // trend: '↘ -1.5%',
    },
    {
      title: 'Number of Community Vaccine Conveyors engaged',
      total: (data?.total_threepl ?? 0).toString(),
      icon: <ConnectWithoutContactIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
      textColor: '#01579B',
      // trend: '↘ +0.4%', 
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={2.4}>
          <VaccineCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}