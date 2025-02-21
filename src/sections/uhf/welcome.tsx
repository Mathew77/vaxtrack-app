import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

export default function WelcomeCard() {
  return (
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
      <Grid container spacing={3} alignItems="center">
        {/* Left Side - Text Content */}
        <Grid item xs={12} md={8}>
          {/* <Typography variant="h4" fontWeight="bold">
            Welcome Back, <strong>Caleb</strong>
          </Typography> */}
          <Typography variant="body1" sx={{ mt: 2, mb: 3, maxWidth: '80%' }}>
            The Supply Chain Application with Offline Capabilities is built to overcome these critical 
            challenges by integrating cutting-edge digital technologies with an operational model that 
            prioritizes efficiency, transparency, and real-time decision-making.
          </Typography>
          
        </Grid>

        {/* Right Side - Infographic Image */}
        <Grid item xs={12} md={4} display="flex" justifyContent="center">
          <img 
            src="/assets/illustrations/supply-chain.png" 
            alt="Supply Chain Illustration"
            style={{ maxWidth: '150px', height: '150px' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
