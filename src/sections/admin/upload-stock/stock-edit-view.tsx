import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StockAtHandData } from 'src/hooks/apis/upload/upload-type';
import { useUpdateStockData } from 'src/hooks/apis/upload/upload-hook';

export default function StockEditView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isView, isUpdate } = location.state || {};
  const stockData = data as StockAtHandData;
  const updateMutation = useUpdateStockData();

  const [formData, setFormData] = useState({
    dose_bcg: '',
    dose_hepb: '',
    dose_bopv: '',
    dose_penta: '',
    dose_pcv: '',
    dose_ipv: '',
    dose_mea: '',
    dose_yf: '',
    dose_td: '',
    dose_mena: '',
    dose_rota: '',
    dose_hpv: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (stockData) {
      setFormData({
        dose_bcg: String(stockData.dose_bcg || 0),
        dose_hepb: String(stockData.dose_hepb || 0),
        dose_bopv: String(stockData.dose_bopv || 0),
        dose_penta: String(stockData.dose_penta || 0),
        dose_pcv: String(stockData.dose_pcv || 0),
        dose_ipv: String(stockData.dose_ipv || 0),
        dose_mea: String(stockData.dose_mea || 0),
        dose_yf: String(stockData.dose_yf || 0),
        dose_td: String(stockData.dose_td || 0),
        dose_mena: String(stockData.dose_mena || 0),
        dose_rota: String(stockData.dose_rota || 0),
        dose_hpv: String(stockData.dose_hpv || 0),
      });
    }
  }, [stockData]);

  const handleInputChange = (field: string, value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!stockData) return;

    try {
      const updateData = {
        id: stockData.id,
        dose_bcg: parseInt(formData.dose_bcg) || 0,
        dose_hepb: parseInt(formData.dose_hepb) || 0,
        dose_bopv: parseInt(formData.dose_bopv) || 0,
        dose_penta: parseInt(formData.dose_penta) || 0,
        dose_pcv: parseInt(formData.dose_pcv) || 0,
        dose_ipv: parseInt(formData.dose_ipv) || 0,
        dose_mea: parseInt(formData.dose_mea) || 0,
        dose_yf: parseInt(formData.dose_yf) || 0,
        dose_td: parseInt(formData.dose_td) || 0,
        dose_mena: parseInt(formData.dose_mena) || 0,
        dose_rota: parseInt(formData.dose_rota) || 0,
        dose_hpv: parseInt(formData.dose_hpv) || 0,
      };

      await updateMutation.mutateAsync(updateData);
      setSuccess('Stock data updated successfully!');

      setTimeout(() => {
        navigate('/maximum-stock');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update stock data');
    }
  };

  if (!stockData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">No data available</Typography>
      </Box>
    );
  }

  const isReadOnly = isView;

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">
          {isView ? 'View' : isUpdate ? 'Edit' : ''} Stock Data - {stockData.name_of_ehf}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/maximum-stock')}>
          Back
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            EHF Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="EHF Name"
                value={stockData.name_of_ehf}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Unique ID"
                value={stockData.assigned_unique_id}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={stockData.state}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="LGA"
                value={stockData.lga}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ward"
                value={stockData.ward}
                disabled
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vaccine Stock Levels
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="BCG"
                value={formData.dose_bcg}
                onChange={(e) => handleInputChange('dose_bcg', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="HepB"
                value={formData.dose_hepb}
                onChange={(e) => handleInputChange('dose_hepb', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="bOPV"
                value={formData.dose_bopv}
                onChange={(e) => handleInputChange('dose_bopv', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Penta"
                value={formData.dose_penta}
                onChange={(e) => handleInputChange('dose_penta', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="PCV"
                value={formData.dose_pcv}
                onChange={(e) => handleInputChange('dose_pcv', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="IPV"
                value={formData.dose_ipv}
                onChange={(e) => handleInputChange('dose_ipv', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Measles"
                value={formData.dose_mea}
                onChange={(e) => handleInputChange('dose_mea', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="YF"
                value={formData.dose_yf}
                onChange={(e) => handleInputChange('dose_yf', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="TD"
                value={formData.dose_td}
                onChange={(e) => handleInputChange('dose_td', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="MenA"
                value={formData.dose_mena}
                onChange={(e) => handleInputChange('dose_mena', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Rota"
                value={formData.dose_rota}
                onChange={(e) => handleInputChange('dose_rota', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="HPV"
                value={formData.dose_hpv}
                onChange={(e) => handleInputChange('dose_hpv', e.target.value)}
                disabled={isReadOnly}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/upload-stock')}
        >
          {isView ? 'Close' : 'Cancel'}
        </Button>
        {isUpdate && (
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={updateMutation.isPending || success !== null}
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Stock'}
          </Button>
        )}
      </Box>
    </Box>
  );
}
