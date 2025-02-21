import React from 'react';
import { Box, Typography, Card, CardContent, Button, IconButton, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const LMDOrderCard = () => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
        borderRadius: 3,
        color: 'white',
        p: 2,
        boxShadow: 5,
        height: 180,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Left Side: Your LMD ORDER */}
          <Grid item xs={6} textAlign="left">
            <Typography variant="h6" fontWeight="bold">
              Your LMD ORDER
            </Typography>
            <Box display="flex" alignItems="center" gap={1} my={1}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                0x9CDBC28F0A6C13BB42ACBD3A3B3...
              </Typography>
              <IconButton size="small" sx={{ color: 'white' }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h4" fontWeight="bold">67</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>Not Distributed</Typography>
          </Grid>

          {/* Right Side: Total LMD Orders */}
          <Grid item xs={6}>
            <Grid container spacing={2} justifyContent="flex-end">
              {/* Total LMD Orders Received */}
              <Grid item xs={6} textAlign="left">
                <Typography variant="body2">Total LMD Orders Received</Typography>
                <Box display="flex" alignItems="left" gap={1} mt={1} justifyContent="left">
                  <Box sx={{ background: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '30%' }}>
                    <ArrowUpwardIcon />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">2,225.22</Typography>
                </Box>
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', mt: 1 }}>View</Button>
              </Grid>

              {/* Total LMD Orders Distributed */}
              <Grid item xs={6} textAlign="left">
                <Typography variant="body2">Total LMD Orders Distributed</Typography>
                <Box display="flex" alignItems="left" gap={1} mt={1} justifyContent="left">
                  <Box sx={{ background: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '30%' }}>
                    <ArrowDownwardIcon />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">225</Typography>
                </Box>
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', mt: 1 }}>View</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LMDOrderCard;
