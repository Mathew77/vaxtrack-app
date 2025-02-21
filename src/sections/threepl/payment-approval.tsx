import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ApprovalIcon from '@mui/icons-material/Approval';
import PaidIcon from '@mui/icons-material/Paid';

const orderSteps = [
  { label: 'LMD Order Uploaded', progress: 80, icon: <CloudUploadIcon fontSize="large" />, color: "#FFAB91" },
  { label: 'Order Payment Approval', progress: 60, icon: <ApprovalIcon fontSize="large" />, color: "#FFD54F" },
  { label: 'Payment Received', progress: 100, icon: <PaidIcon fontSize="large" />, color: "#81C784" }
];

const LMDOrderStatus = () => {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)', color: 'white' }}>
      <Typography variant="h6" fontWeight="bold" textAlign="left" mb={2}>
        LMD Order Status
      </Typography>
      {orderSteps.map((step, index) => (
        <CardContent key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {step.icon}
            <Typography variant="body1" fontWeight="bold">{step.label}</Typography>
          </Box>
          <Box flexGrow={1}>
            <LinearProgress 
              variant="determinate" 
              value={step.progress} 
              sx={{ height: 8, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { backgroundColor: step.color } }}
            />
          </Box>
          <Typography variant="body2" fontWeight="bold">{step.progress}%</Typography>
        </CardContent>
      ))}
    </Card>
  );
};

export default LMDOrderStatus;
