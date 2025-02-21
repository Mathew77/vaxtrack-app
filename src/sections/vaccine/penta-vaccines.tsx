import React from "react";
import { TextField, Box, Typography, Grid, Button } from "@mui/material";



export const  PentaVaccine: React.FC  = () => {
  return (
    <Box mt={3} sx={{ width: '100%' }}>
          <Typography
            variant="h6"
            sx={{
              mb: 7,
              border: '1px solid #1976D2',
              borderRadius: 1, 
              backgroundColor: '#1976D2', 
              color: 'white', 
              padding: 2,
              textAlign: 'left',
              width: '100%', 
            }}
          >
            Penta Vaccine
          </Typography>
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body1">HepB Vaccine</Typography>
          <TextField fullWidth variant="outlined" />
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body1">0.05ml syringe per vaccine dosage</Typography>
          <TextField
            fullWidth
            variant="outlined"
          />
        </Box>
      </Grid>
    </Grid>

    {/* <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body1">5ml Syringe</Typography>
          <TextField fullWidth variant="outlined" />
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body1">0.05ml syringe per vaccine dosage</Typography>
          <TextField fullWidth variant="outlined" />
        </Box>
      </Grid>
    </Grid> */}

    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
            <Button
            variant="contained"
            sx={{
                backgroundColor: '#1976D2',
                border: '3px solid #1976D2', 
                borderRadius: 1, 
                color: 'white',
            }}
            >
            Submit
            </Button>
        </Box>
  </Box>
  );
};
