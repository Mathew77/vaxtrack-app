import { useMemo } from 'react';


import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';


// ----------------------------------------------------------------------


export function WelcomeCard() {
  const userName = sessionStorage.getItem('username') || '';
  const firstName = sessionStorage.getItem('firstName') || '';
  const userRole = sessionStorage.getItem('userRole') || '';

  const { data: allScs } = useFetchScs();


  const userState = useMemo(() => {
    try {
      const listData = sessionStorage.getItem('scs_list');
      if (listData) {
        let parsed = JSON.parse(listData);
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Robust parsing handling both objects and strings (IDs or dash-prefixed)
          if (typeof parsed[0] === 'object' && parsed[0] !== null && 'state' in parsed[0]) {
            return parsed[0].state;
          }
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
      console.error('Error deriving state in WelcomeCard:', error);
    }
    return '';
  }, [allScs]);


  const displayName = firstName || userName;


  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={6} md={6}>
        <Box
          sx={{
            p: 4,
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
            State Cold Chain Store - Monitor and manage your local vaccine inventory.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} md={6}>
        <Box
          component="img"
          src="/assets/illustrations/illustration-welcome.svg"
          sx={{ width: '100%', maxWidth: 360, display: 'block', mx: 'auto' }}
        />
      </Grid>
    </Grid>
  );
}
