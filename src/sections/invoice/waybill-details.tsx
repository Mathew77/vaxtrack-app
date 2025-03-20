import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  Paper,
  InputAdornment,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFetchInvoice, useUpsertInvoice, MinimalInvoicePayload } from 'src/hooks/apis/invoice/invoice-hooks';
import { InvoiceType } from 'src/hooks/apis/invoice/invoice-type';
import { toast } from 'react-toastify';


const WayBillDetails = () => {

    const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const upsertInvoices = useUpsertInvoice();


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const initialValues = {
    waybill_number: '',
    status: '',
    invoice_number: '',
    carrier_name: '',
    approval_date: '',
    payment_date: '',
    payment_rate: '',
    delivery_proof: '',
    payment_request: '',
    payment_request_date: '',
    approved_by: '',
    created_by: '',
  };

  const [data, setData] = useState<InvoiceType>(initialValues);


  useEffect(() => {
    if (state?.data) {
      setData({
        ...data,
        waybill_number: state.data.waybill_number,
        status: state.data.status,
        approval_date: state.data.date,
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
    }
  }, [state]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };


  const handleSubmit = () => {``
    const payload: MinimalInvoicePayload = {
      waybill_number: data.waybill_number,
      ...(selectedFile && { delivery_proof: selectedFile }),
    };

    upsertInvoices.mutate(
      { data: payload },
      {
        onSuccess: (response) => {
          toast.success(response?.status || "Invoice Submitted Successfully");
          navigate('/waybill-invoice-page');
        },
        onError: (error) => {
          toast.error("Failed to submit invoice");
          console.error(error);
        }
      }
    );
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">Waybill Details</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/waybill-invoice-page')}>
          Back
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography component="label" htmlFor="waybill_number">
            Waybill Number
          </Typography>
          <TextField
            fullWidth
            id="waybill_number"
            name="waybill_number"
            placeholder="Waybill Number"
            value={data.waybill_number}
            variant="outlined"
            disabled
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="approval_date">
            Waybill Date
          </Typography>
          <TextField
            fullWidth
            id="approval_date"
            name="approval_date"
            placeholder="Waybill Date"
            value={data.approval_date}
            variant="outlined"
            disabled
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="status">
            Waybill Status
          </Typography>
          <TextField
            fullWidth
            id="status"
            name="status"
            placeholder="Waybill Status"
            value={data.status}
            variant="outlined"
            disabled
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Typography component="label" sx={{ mb: 1, display: 'block' }}>
            Upload Waybill Documents<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: '4px',
              bgcolor: '#f5f9ff',
              '&:hover': {
                bgcolor: '#e8f0fe',
              },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              {!selectedFile ? (
                <>
                  <input
                    accept=".pdf,.doc,.docx,image/png,image/jpeg"
                    style={{ display: 'none' }}
                    id="documents"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="documents">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 1 }}
                    >
                      Upload Document
                    </Button>
                  </label>
                  <Typography variant="body2" color="text.secondary">
                    Drag and drop files here or click to upload
                    <br />
                    (PDF, DOC, DOCX, PNG, JPEG files only)
                  </Typography>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TextField
                    fullWidth
                    value={selectedFile.name}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CloudUploadIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    color="error"
                    onClick={handleRemoveFile}
                    startIcon={<DeleteIcon />}
                    sx={{ ml: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Raise Invoice
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/waybill-invoice-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default WayBillDetails;