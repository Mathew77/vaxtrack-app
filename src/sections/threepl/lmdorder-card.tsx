import React from 'react';
import { Box, Typography, Card, CardContent, Button, IconButton } from '@mui/material';
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
        height: 180, // Reduced height
      }}
    >
      <CardContent>
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
        <Typography variant="h4" fontWeight="bold"> {/* Adjusted font size */}
          67
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Not Distributed
        </Typography>

        <Box display="flex" justifyContent="flex-end" gap={5} mt={2}> {/* Reduced margin */}
          {/* Total LMD Orders Received */}
          <Box textAlign="center">
            <Typography variant="body2">Total LMD Orders Received</Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Box sx={{ background: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '50%' }}>
                <ArrowUpwardIcon />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                2,225.22
              </Typography>
            </Box>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', mt: 1 }}>
              View
            </Button>
          </Box>

          {/* Total LMD Orders Distributed */}
          <Box textAlign="center">
            <Typography variant="body2">Total LMD Orders Distributed</Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Box sx={{ background: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '50%' }}>
                <ArrowDownwardIcon />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                225
              </Typography>
            </Box>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', mt: 1 }}>
              View
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LMDOrderCard;
