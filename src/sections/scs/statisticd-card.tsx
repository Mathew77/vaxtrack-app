import React from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

interface VaccineCardProps {
  title: string;
  total: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  trend: string;
}

const VaccineCard: React.FC<VaccineCardProps> = ({ title, total, icon, bgColor, textColor, trend }) => {
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
        <Typography variant="body2" sx={{ position: 'absolute', top: 10, right: 15, fontWeight: 'bold' }}>
          {trend}
        </Typography>
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
  return (
    <Grid container spacing={2}>
      {[
        {
          title: 'EHF LMD Order Received',
          total: '4',
          icon: <VaccinesIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          textColor: '#0D47A1',
          trend: '↗ +2.6%',
        },
        {
          title: 'EHF LMD Order Serviced',
          total: '4',
          icon: <LocalShippingIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          textColor: '#1B5E20',
          trend: '↗ +1.2%',
        },
        {
          title: 'EHF LMD Order Serviced in Full',
          total: '3',
          icon: <PendingActionsIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
          textColor: '#B71C1C',
          trend: '↘ -0.8%',
        },
        {
          title: 'EHF with non-functioning CCE EHF',
          total: '10',
          icon: <PendingActionsIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          textColor: '#E65100',
          trend: '↘ -1.5%',
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
