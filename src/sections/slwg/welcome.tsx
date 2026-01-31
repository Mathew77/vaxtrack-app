import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';



// Define the types for the props
interface CardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  bgColor: string;
  shadowColor: string;
}

const cardData: CardProps[] = [
  { title: 'Total EHF', value: 35, icon: <LocalHospitalIcon />, bgColor: '#3F51B5', shadowColor: 'rgba(63, 81, 181, 0.3)' },
  { title: 'Total UHF', value: 23, icon: <OpenInNewIcon />, bgColor: '#F57C00', shadowColor: 'rgba(245, 124, 0, 0.3)' },
  { title: 'Total LCS', value: 5, icon: <AccountBalanceIcon />, bgColor: '#1976D2', shadowColor: 'rgba(25, 118, 210, 0.3)' },
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

const WelcomeHeader = () => {
  const userName = sessionStorage.getItem('username') || '';
  const firstName = sessionStorage.getItem('firstName') || '';
  const userRole = sessionStorage.getItem('userRole') || '';

  const { data: allScs } = useFetchScs();

  const userState = React.useMemo(() => {
    const parseAndExtract = (key: string): string => {
      try {
        const listData = sessionStorage.getItem(key);
        if (listData) {
          let parsed = JSON.parse(listData);
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
          }
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Check for object with 'state' property
            if (typeof parsed[0] === 'object' && parsed[0] !== null && 'state' in parsed[0]) {
              return parsed[0].state;
            }
            // Check for string (ID or dash-prefixed name)
            if (typeof parsed[0] === 'string') {
              const val = parsed[0];
              if (val.includes('-')) {
                return val.split('-')[0];
              }

              // Resolve numeric ID to state name
              if (!isNaN(Number(val)) && allScs) {
                const scsRecord = allScs.find(s => s.id?.toString() === val);
                if (scsRecord && scsRecord.stat_id) {
                  return scsRecord.stat_id;
                }
              }
              return val;
            }
          }
        }
      } catch (error) {
        console.error(`Error parsing ${key} in SLWG WelcomeHeader:`, error);
      }
      return '';
    };

    let state = parseAndExtract('slwg_list');
    if (!state) {
      state = parseAndExtract('scs_list');
    }
    return state;
  }, [allScs]);

  const displayName = firstName || userName;

  return (
    <Box
      sx={{
        p: 4,
        mb: 3,
        borderRadius: 3,
        background: 'linear-gradient(90deg, #7B8FF7, #E0A9F5)',
        color: 'white',
        boxShadow: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Welcome : <strong>{displayName.toUpperCase()}</strong> ({userRole.toUpperCase()}{userState ? `: ${userState}` : ''})
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
        State Logistics Working Group - Coordinating vaccine supply and distribution.
      </Typography>
    </Box>
  );
};

const DashboardCards = () => {
  return (
    <Box>
      <WelcomeHeader />
      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardCards;
