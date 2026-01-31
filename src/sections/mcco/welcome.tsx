import React, { useMemo } from 'react';
import { Box, Typography, Grid } from '@mui/material';


export default function WelcomeCard() {
  const userName = sessionStorage.getItem('username') || '';
  const firstName = sessionStorage.getItem('firstName') || '';
  const userRole = sessionStorage.getItem('userRole') || '';

  const userState = useMemo(() => {
    try {
      const ehfListData = sessionStorage.getItem('ehf_list');
      if (ehfListData) {
        let parsed = JSON.parse(ehfListData);
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const assignedId = parsed[0];
          if (typeof assignedId === 'string' && assignedId.includes('-')) {
            return assignedId.split('-')[0];
          }
        }
      }
    } catch (error) {
      console.error('Error deriving state in MCCO WelcomeCard:', error);
    }
    return '';
  }, []);

  const displayName = firstName || userName;

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12} md={12}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #7B8FF7, #E0A9F5)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 2,
          }}
        >
          {/* Left Side - Text Content */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              Welcome : <strong>{displayName.toUpperCase()}</strong> ({userRole.toUpperCase()}{userState ? `: ${userState}` : ''})
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 3, maxWidth: '80%' }}>
              Mobile Cold Chain Officer - Managing vaccine distribution and cold chain logistics
              to ensure vaccines reach their destinations safely and efficiently.
            </Typography>
          </Grid>

          {/* Right Side - Infographic Image */}
          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <img
              src="/assets/illustrations/supply-chain.png"
              alt="MCCO Illustration"
              style={{ maxWidth: '150px', height: '150px' }}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
