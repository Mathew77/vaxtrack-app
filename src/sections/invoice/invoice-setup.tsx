import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate, useLocation,  } from 'react-router-dom';
import { InvoiceType } from 'src/hooks/apis/invoice/invoice-type';
import { useUpsertInvoice } from 'src/hooks/apis/invoice/invoice-hooks';
import { toast } from 'react-toastify';

export function InvoiceForm() {

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

  const upsertInvoice = useUpsertInvoice()

  const initialValues: InvoiceType = {
    invoice_number: "",
    carrier_name: "",
    waybill_number: "",
    status: "",
    approval_date: "",
    payment_date: "",
    remark: "",
    payment_rate: "",
    delivery_proof: "",
    payment_request: "",
    payment_request_date: "",
    approved_by: "",
    created_by: ""
  };

  const [data, setData] = useState<InvoiceType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

//   const setCurrentState = () => {
//     const invoiceData = state.data;
//     setData(invoiceData);
//     setIsUpdate(state.isUpdate || false);
//     setIsView(state.isView || false);
//   };

//   useEffect(() => {
//     if (state?.data) {
//       setCurrentState();
//     }
//   }, [state]);

  const validate = () => {
    let temp = { ...errors };
    temp.invoice_number = data.invoice_number 
        ? '' 
        : 'Invoice number is required';
    temp.carrier_name = data.carrier_name 
        ? '' 
        : 'Carrier name is required';
    temp.waybill_number = data.waybill_number 
        ? '' 
        : 'Waybill number is required';
    temp.created_by = data.created_by 
        ? '' 
        : 'Created by is required';
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
        upsertInvoice.mutate(
            { data },
            {onSuccess: (response) => {
                toast.success(response?.status)
                navigate('/threepl-home')
            }}
        )
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Invoice Management Setup</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography component="label" htmlFor="invoice_number">
            Invoice Number<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="invoice_number"
            name="invoice_number"
            placeholder="Enter Invoice Number"
            value={data.invoice_number}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.invoice_number && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.invoice_number}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="carrier_name">
            Carrier Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="carrier_name"
            name="carrier_name"
            placeholder="Carrier Name"
            value={data.carrier_name}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.carrier_name && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.carrier_name}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="waybill_number">
            Waybill Number<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="waybill_number"
            name="waybill_number"
            placeholder="Waybill Number"
            value={data.waybill_number}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.waybill_number && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.waybill_number}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="status" >
              Status
            </Typography>
            <Select
              id="status"
              name="status"
              value={data.status}
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              disabled={isView}
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select Status
              </MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="approval_date">
            Approval Date
          </Typography>
          <TextField
            fullWidth
            id="approval_date"
            name="approval_date"
            type="datetime-local"
            value={data.approval_date}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="payment_date">
            Payment Date
          </Typography>
          <TextField
            fullWidth
            id="payment_date"
            name="payment_date"
            type="date"
            value={data.payment_date}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="payment_rate">
            Payment Rate
          </Typography>
          <TextField
            fullWidth
            id="payment_rate"
            name="payment_rate"
            placeholder="Payment Rate"
            value={data.payment_rate}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="delivery_proof">
            Delivery Proof
          </Typography>
          <TextField
            fullWidth
            id="delivery_proof"
            name="delivery_proof"
            placeholder="Delivery Proof"
            value={data.delivery_proof}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="payment_request">
              Payment Request
            </Typography>
            <Select
              id="payment_request"
              name="payment_request"
              value={data.payment_request}
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              disabled={isView}
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select Payment Request
              </MenuItem>
              <MenuItem value="Submitted">Submitted</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processed">Processed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="payment_request_date">
            Payment Request Date
          </Typography>
          <TextField
            fullWidth
            id="payment_request_date"
            name="payment_request_date"
            type="datetime-local"
            value={data.payment_request_date}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="approved_by">
            Approved By
          </Typography>
          <TextField
            fullWidth
            id="approved_by"
            name="approved_by"
            placeholder="Approved By"
            value={data.approved_by || ''}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="created_by">
            Created By<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="created_by"
            name="created_by"
            placeholder="Created By"
            value={data.created_by}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.created_by && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.created_by}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="remark">
            Remark
          </Typography>
          <TextField
            fullWidth
            id="remark"
            name="remark"
            placeholder="Remark"
            value={data.remark || ''}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        {/* <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/invoice-page')}>
          Cancel
        </Button> */}
      </Box>
    </Container>
  );
}

