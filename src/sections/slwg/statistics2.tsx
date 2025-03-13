import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import CCE from './cce';
import CCE2 from './vvm';


export default function Statistics2() {
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={6} md={6}>
      <CCE2 />
      </Grid>
      <Grid item xs={6} md={6}>
        <CCE />
      </Grid>
    </Grid>
  );
}
