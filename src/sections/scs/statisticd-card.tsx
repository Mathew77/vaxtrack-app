import React from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import RailwayAlertIcon from '@mui/icons-material/RailwayAlert';
import { useFetchScsDashboard } from 'src/hooks/apis/dashboards/scs/scs-dashboard-hook';



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

  const { data } = useFetchScsDashboard();
  
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
          title: 'EHF LMD Order Received',
          total: (data.Total_EHF_LMD_Order_Received || 0).toString(),
          icon: <VaccinesIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          textColor: '#0D47A1',
          trend: '↗ +2.6%',
        },
        {
          title: 'EHF LMD Order Serviced',
          total: (data.Total_EHF_LMD_Order_Serviced || 0).toString(),
          icon: <RoomServiceIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          textColor: '#1B5E20',
          trend: '↗ +1.2%',
        },
        {
          title: 'EHF LMD Order Serviced in Full',
          total: (data.Total_EHF_LMD_Order_Serviced_in_Full || 0).toString(),
          icon: <HourglassFullIcon fontSize="large" />,
          bgColor: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
          textColor: '#B71C1C',
          trend: '↘ -0.8%',
        },
        {
          title: 'EHF with non-functioning CCE EHF',
          total: (data.Total_EHF_with_non_functioning_CCE || 0).toString(),
          icon: <RailwayAlertIcon fontSize="large" />,
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
