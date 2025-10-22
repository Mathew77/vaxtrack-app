import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'react-toastify';
import { useUpdateAllocationStatus } from 'src/hooks/apis/upload/upload-hook';

interface VaccineReturnData {
  name: string;
  allocated: number;
  received: number;
  difference: number;
  returned: number;
}

const VaccineAllocationLcsReturnView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, userRole } = location.state || {};

  const updateStatusMutation = useUpdateAllocationStatus();

  const [vaccines, setVaccines] = useState<VaccineReturnData[]>([
    {
      name: 'BCG',
      allocated: data?.dose_bcg_allocated || 0,
      received: data?.dose_bcg_received || 0,
      difference: Math.max(0, (data?.dose_bcg_allocated || 0) - (data?.dose_bcg_received || 0)),
      returned: 0,
    },
    {
      name: 'HepB',
      allocated: data?.dose_hepb_allocated || 0,
      received: data?.dose_hepb_received || 0,
      difference: Math.max(0, (data?.dose_hepb_allocated || 0) - (data?.dose_hepb_received || 0)),
      returned: 0,
    },
    {
      name: 'bOPV',
      allocated: data?.dose_bopv_allocated || 0,
      received: data?.dose_bopv_received || 0,
      difference: Math.max(0, (data?.dose_bopv_allocated || 0) - (data?.dose_bopv_received || 0)),
      returned: 0,
    },
    {
      name: 'Penta',
      allocated: data?.dose_penta_allocated || 0,
      received: data?.dose_penta_received || 0,
      difference: Math.max(0, (data?.dose_penta_allocated || 0) - (data?.dose_penta_received || 0)),
      returned: 0,
    },
    {
      name: 'PCV',
      allocated: data?.dose_pcv_allocated || 0,
      received: data?.dose_pcv_received || 0,
      difference: Math.max(0, (data?.dose_pcv_allocated || 0) - (data?.dose_pcv_received || 0)),
      returned: 0,
    },
    {
      name: 'IPV',
      allocated: data?.dose_ipv_allocated || 0,
      received: data?.dose_ipv_received || 0,
      difference: Math.max(0, (data?.dose_ipv_allocated || 0) - (data?.dose_ipv_received || 0)),
      returned: 0,
    },
    {
      name: 'Measles',
      allocated: data?.dose_mea_allocated || 0,
      received: data?.dose_mea_received || 0,
      difference: Math.max(0, (data?.dose_mea_allocated || 0) - (data?.dose_mea_received || 0)),
      returned: 0,
    },
    {
      name: 'YF',
      allocated: data?.dose_yf_allocated || 0,
      received: data?.dose_yf_received || 0,
      difference: Math.max(0, (data?.dose_yf_allocated || 0) - (data?.dose_yf_received || 0)),
      returned: 0,
    },
    {
      name: 'TD',
      allocated: data?.dose_td_allocated || 0,
      received: data?.dose_td_received || 0,
      difference: Math.max(0, (data?.dose_td_allocated || 0) - (data?.dose_td_received || 0)),
      returned: 0,
    },
    {
      name: 'MenA',
      allocated: data?.dose_mena_allocated || 0,
      received: data?.dose_mena_received || 0,
      difference: Math.max(0, (data?.dose_mena_allocated || 0) - (data?.dose_mena_received || 0)),
      returned: 0,
    },
    {
      name: 'Rota',
      allocated: data?.dose_rota_allocated || 0,
      received: data?.dose_rota_received || 0,
      difference: Math.max(0, (data?.dose_rota_allocated || 0) - (data?.dose_rota_received || 0)),
      returned: 0,
    },
    {
      name: 'HPV',
      allocated: data?.dose_hpv_allocated || 0,
      received: data?.dose_hpv_received || 0,
      difference: Math.max(0, (data?.dose_hpv_allocated || 0) - (data?.dose_hpv_received || 0)),
      returned: 0,
    },
  ]);

  if (!data) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="error">
          No allocation data found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vaccine-allocation-stock-page')}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </DashboardContent>
    );
  }

  const handleReturnChange = (index: number, value: string) => {
    const updatedVaccines = [...vaccines];
    const returnedAmount = parseInt(value) || 0;

    // Ensure returned amount doesn't exceed the difference
    updatedVaccines[index] = {
      ...updatedVaccines[index],
      returned: Math.min(returnedAmount, updatedVaccines[index].difference),
    };
    setVaccines(updatedVaccines);
  };

  const validateForm = () => {
    // Check if vaccines with discrepancies have valid return amounts
    const vaccinesWithDiscrepancy = vaccines.filter(v => v.difference > 0);

    for (const vaccine of vaccinesWithDiscrepancy) {
      if (vaccine.returned > vaccine.difference) {
        toast.error(`${vaccine.name}: Returned amount cannot exceed difference (${vaccine.difference})`);
        return false;
      }
    }

    return true;
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

    // Map vaccine names to field names
    const vaccineFieldMap: { [key: string]: string } = {
      'BCG': 'bcg',
      'HepB': 'hepb',
      'bOPV': 'bopv',
      'Penta': 'penta',
      'PCV': 'pcv',
      'IPV': 'ipv',
      'Measles': 'mea',
      'YF': 'yf',
      'TD': 'td',
      'MenA': 'mena',
      'Rota': 'rota',
      'HPV': 'hpv',
    };

    // Build vaccine return data
    const vaccineReturnData: any = {};
    vaccines.forEach(v => {
      const fieldName = vaccineFieldMap[v.name];
      if (fieldName) {
        vaccineReturnData[`dose_${fieldName}_return`] = v.returned;
      }
    });

    // LCS always sets status to 4 (Completed) after review
    // Whether vaccines were returned or not is tracked in the returned fields
    const finalStatus = 4;

    // Prepare the data for update
    const updatePayload = {
      ehf_id: data.ehf_id,
      assigned_unique_id: data.assigned_unique_id,
      period: data.period,
      dose_bcg_actual: data.dose_bcg_actual,
      dose_bcg_allocated: data.dose_bcg_allocated,
      dose_hepb_actual: data.dose_hepb_actual,
      dose_hepb_allocated: data.dose_hepb_allocated,
      dose_bopv_actual: data.dose_bopv_actual,
      dose_bopv_allocated: data.dose_bopv_allocated,
      dose_penta_actual: data.dose_penta_actual,
      dose_penta_allocated: data.dose_penta_allocated,
      dose_pcv_actual: data.dose_pcv_actual,
      dose_pcv_allocated: data.dose_pcv_allocated,
      dose_ipv_actual: data.dose_ipv_actual,
      dose_ipv_allocated: data.dose_ipv_allocated,
      dose_mea_actual: data.dose_mea_actual,
      dose_mea_allocated: data.dose_mea_allocated,
      dose_yf_actual: data.dose_yf_actual,
      dose_yf_allocated: data.dose_yf_allocated,
      dose_td_actual: data.dose_td_actual,
      dose_td_allocated: data.dose_td_allocated,
      dose_mena_actual: data.dose_mena_actual,
      dose_mena_allocated: data.dose_mena_allocated,
      dose_rota_actual: data.dose_rota_actual,
      dose_rota_allocated: data.dose_rota_allocated,
      dose_hpv_actual: data.dose_hpv_actual,
      dose_hpv_allocated: data.dose_hpv_allocated,
      // Add vaccine return data
      ...vaccineReturnData,
    };

    updateStatusMutation.mutate(
      { id: data.id, status: finalStatus, data: updatePayload },
      {
        onSuccess: () => {
          toast.success('LCS review completed successfully!');
          navigate('/vaccine-allocation-stock-page');
        },
        onError: () => {
          toast.error('Failed to process. Please try again.');
        },
      }
    );
  };

  const getStatusLabel = (status: number) => {
    if (status === 0) return 'Pending SCS Confirmation';
    if (status === 1) return 'Pending 3PL Pickup';
    if (status === 2) return 'Pending MCCO Confirmation';
    if (status === 3) return 'Pending LCS Review';
    if (status === 4) return 'Completed';
    return 'Unknown';
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'warning';
    if (status === 1) return 'info';
    if (status === 2) return 'warning';
    if (status === 3) return 'warning';
    if (status === 4) return 'success';
    return 'default';
  };

  // Only show vaccines with discrepancies
  const vaccinesWithDiscrepancy = vaccines.filter(v => v.difference > 0);

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vaccine-allocation-stock-page')}
        >
          Back
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">LCS Vaccine Return Processing</Typography>
            <Chip
              label={getStatusLabel(data.status)}
              color={getStatusColor(data.status)}
              size="medium"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                EHF Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.name_of_ehf || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Unique ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.assigned_unique_id}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                State
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.state || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                LGA
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.lga || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom color="error">
            Vaccines with Discrepancies
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
            The following vaccines have a difference between allocated and received amounts.
            Please enter the number of vaccines returned to LCS.
          </Typography>

          {vaccinesWithDiscrepancy.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="body1" color="textSecondary">
                No discrepancies found. All allocated vaccines were received.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Vaccine</strong></TableCell>
                    <TableCell align="center"><strong>Allocated</strong></TableCell>
                    <TableCell align="center"><strong>Received</strong></TableCell>
                    <TableCell align="center"><strong>Difference</strong></TableCell>
                    <TableCell align="center"><strong>Returned</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vaccinesWithDiscrepancy.map((vaccine) => {
                    const actualIndex = vaccines.findIndex(v => v.name === vaccine.name);
                    return (
                      <TableRow key={vaccine.name}>
                        <TableCell sx={{ fontWeight: 600 }}>{vaccine.name}</TableCell>
                        <TableCell align="center">{vaccine.allocated}</TableCell>
                        <TableCell align="center">{vaccine.received}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={vaccine.difference}
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            size="small"
                            value={vaccine.returned || ''}
                            onChange={(e) => handleReturnChange(actualIndex, e.target.value)}
                            inputProps={{
                              min: 0,
                              max: vaccine.difference,
                              style: { textAlign: 'center' }
                            }}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/vaccine-allocation-stock-page')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={handleConfirm}
              disabled={updateStatusMutation.isPending}
              sx={{
                background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                },
              }}
            >
              {updateStatusMutation.isPending ? 'Processing...' : 'Confirm Returns'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </DashboardContent>
  );
};

export default VaccineAllocationLcsReturnView;
