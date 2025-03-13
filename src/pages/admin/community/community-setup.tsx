import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface FormData {
  vaccineProductName: string;
  quantityRequestedByUHF: string;
  quantityDispenseByEHF: string;
  quantityReturned: string;
  receivedBy: string;
  dispensedBy: string;
  returnedBy: string;
}

interface Option {
  id: string;
  name: string;
}

export default function CommunityVaccine() {
  const initialValues: FormData = {
    vaccineProductName: '',
    quantityRequestedByUHF: '',
    quantityDispenseByEHF: '',
    quantityReturned: '',
    receivedBy: '',
    dispensedBy: '',
    returnedBy: '',
  };

  const [data, setData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [vaccineProducts, setVaccineProducts] = useState<Option[]>([]);

  const staticVaccineProducts: Option[] = [
    { id: 'bcg', name: 'BCG Vaccine' },
    { id: 'measles', name: 'Measles Vaccine' },
    { id: 'yf', name: 'YF Vaccine' },
    { id: 'menA', name: 'MenA Vaccine' },
    { id: 'rotaa', name: 'Rota Vaccine' },
    { id: 'hpv', name: 'HPV Vaccine' },
    { id: 'hepB', name: 'HepB Vaccine' },
    { id: 'bopv', name: 'BOPV Vaccine' },
    { id: 'penta', name: 'Penta Vaccine' },
    { id: 'pcv', name: 'PCV Vaccine' },
    { id: 'ipv', name: 'IPV Vaccine' },
    { id: 'td', name: 'Td Vaccine' },
  ];

  const validate = () => {
    let temp = { ...errors };
    temp.vaccineProductName = data.vaccineProductName ? '' : 'Vaccine product is required';
    temp.quantityRequestedByUHF = data.quantityRequestedByUHF ? '' : 'Quantity requested is required';
    temp.quantityDispenseByEHF = data.quantityDispenseByEHF ? '' : 'Quantity dispensed is required';
    temp.quantityReturned = data.quantityReturned ? '' : 'Quantity returned is required';
    temp.receivedBy = data.receivedBy ? '' : 'Received by is required';
    temp.dispensedBy = data.dispensedBy ? '' : 'Dispensed by is required';
    temp.returnedBy = data.returnedBy ? '' : 'Returned by is required';
    
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeVaccineProduct = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setData((prev) => ({
      ...prev,
      vaccineProductName: value,
    }));
  };

  useEffect(() => {
    setVaccineProducts(staticVaccineProducts); 
  }, []);

  const handleSubmit = () => {
    if (validate()) {
      console.log('Submitting data:', data);
      try {
        console.log('Form submitted successfully (simulated)');
        setData(initialValues);
        setErrors({});
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Community Vaccine Conveyor
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography component="label" htmlFor="vaccineProductName">
            Vaccine Product<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              id="vaccineProductName"
              name="vaccineProductName"
              value={data.vaccineProductName}
              onChange={handleChangeVaccineProduct}
              displayEmpty
            >
              <MenuItem value="">
                Select Vaccine Product
              </MenuItem>
              {vaccineProducts.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
            {errors.vaccineProductName && (
              <Typography sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors.vaccineProductName}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="quantityRequestedByUHF">
            Quantity Requested by UHF<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="quantityRequestedByUHF"
            name="quantityRequestedByUHF"
            placeholder="Enter Quantity"
            value={data.quantityRequestedByUHF}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.quantityRequestedByUHF && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.quantityRequestedByUHF}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="quantityDispenseByEHF">
            Quantity Dispense by EHF<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="quantityDispenseByEHF"
            name="quantityDispenseByEHF"
            placeholder="Enter Quantity"
            value={data.quantityDispenseByEHF}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.quantityDispenseByEHF && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.quantityDispenseByEHF}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="quantityReturned">
            Quantity Returned<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="quantityReturned"
            name="quantityReturned"
            placeholder="Enter Quantity"
            value={data.quantityReturned}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.quantityReturned && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.quantityReturned}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="receivedBy">
            Received By<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="receivedBy"
            name="receivedBy"
            placeholder="Enter Name"
            value={data.receivedBy}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.receivedBy && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.receivedBy}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="dispensedBy">
            Dispensed By<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="dispensedBy"
            name="dispensedBy"
            placeholder="Enter Name"
            value={data.dispensedBy}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.dispensedBy && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.dispensedBy}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="returnedBy">
            Returned By<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="returnedBy"
            name="returnedBy"
            placeholder="Enter Name"
            value={data.returnedBy}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.returnedBy && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.returnedBy}</span>
              )
            }
          />
        </Grid>

      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};
