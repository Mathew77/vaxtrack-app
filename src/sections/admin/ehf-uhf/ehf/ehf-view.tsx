import {
  Box,
  Button,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import VaccinesIcon from '@mui/icons-material/Vaccines';

export default function EhfView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const data = state?.data || {};
  const activeTab = state?.activeTab || 0;

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <Grid container spacing={2} sx={{ mb: 1.5, alignItems: 'center' }}>
      <Grid item xs={12} sm={5} md={4}>
        <Typography variant="body2" fontWeight={500} color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={7} md={8}>
        <Typography variant="body1" fontWeight={600} color="text.primary">
          {value || '-'}
        </Typography>
      </Grid>
    </Grid>
  );

  const getStatusChip = (status: string) => {
    const isPositive = status?.toLowerCase() === 'functional' || status?.toLowerCase() === 'yes';
    return (
      <Chip
        label={status || '-'}
        color={isPositive ? 'success' : 'default'}
        size="small"
        icon={isPositive ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
        sx={{ fontWeight: 600 }}
      />
    );
  };

  const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 1.5, color: 'primary.main', display: 'flex' }}>{icon}</Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">View Equipped Health Facility</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ehf-uhf-page', { state: { activeTab } })}
        >
          Back
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Basic Information" icon={<MedicalServicesIcon />}>
            <InfoRow label="Ward" value={data.ward} />
            <InfoRow label="Serial Number" value={data.serial_no} />
            <InfoRow label="Phone Number" value={data.phone_number} />
          </SectionCard>
        </Grid>

        {/* Logistics Information */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Logistics Information" icon={<LocalShippingIcon />}>
            <InfoRow label="Distance from SCS" value={data.distance_km_from_scs ? `${data.distance_km_from_scs} km` : '-'} />
            <InfoRow label="Travel Time from SCS" value={data.est_travel_hours_from_scs ? `${data.est_travel_hours_from_scs} hrs` : '-'} />
            <InfoRow label="Hard to Reach" value={<>{getStatusChip(data.hard_to_reach)}</>} />
          </SectionCard>
        </Grid>

        {/* Service Information */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Service Information" icon={<MedicalServicesIcon />}>
            <InfoRow label="Offering RI Services" value={<>{getStatusChip(data.offering_ri_services)}</>} />
            {data.reason_not_offering_ri && (
              <InfoRow label="Reason Not Offering RI" value={data.reason_not_offering_ri} />
            )}
            {data.delivery_route && <InfoRow label="Delivery Route" value={data.delivery_route} />}
          </SectionCard>
        </Grid>

        {/* Cold Chain Equipment */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Cold Chain Equipment" icon={<AcUnitIcon />}>
            <InfoRow label="CCE Count" value={data.cce_count} />
            <InfoRow label="CCE Model" value={data.cce_model} />
            <InfoRow label="CCE Status" value={<>{getStatusChip(data.cce_functionality_status)}</>} />
            <InfoRow label="CCE Capacity" value={data.cce_capacity_l ? `${data.cce_capacity_l} L` : '-'} />
            <InfoRow label="Storage Utilized" value={data.total_vaccine_storage_volume_utilized ? `${data.total_vaccine_storage_volume_utilized} L` : '-'} />
            <InfoRow label="Remaining Capacity" value={data.remaining_cce_storage_capacity ? `${data.remaining_cce_storage_capacity} L` : '-'} />
          </SectionCard>
        </Grid>

        {/* Vaccine Stock Levels */}
        <Grid item xs={12}>
          <SectionCard title="Vaccine Stock Levels (Doses)" icon={<VaccinesIcon />}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <InfoRow label="BCG" value={data.dose_bcg?.toLocaleString()} />
                <InfoRow label="HepB" value={data.dose_hepb?.toLocaleString()} />
                <InfoRow label="bOPV" value={data.dose_bopv?.toLocaleString()} />
                <InfoRow label="Penta" value={data.dose_penta?.toLocaleString()} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InfoRow label="PCV" value={data.dose_pcv?.toLocaleString()} />
                <InfoRow label="IPV" value={data.dose_ipv?.toLocaleString()} />
                <InfoRow label="Measles" value={data.dose_mea?.toLocaleString()} />
                <InfoRow label="Yellow Fever" value={data.dose_yf?.toLocaleString()} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InfoRow label="Td" value={data.dose_td?.toLocaleString()} />
                <InfoRow label="MenA" value={data.dose_mena?.toLocaleString()} />
                <InfoRow label="Rota" value={data.dose_rota?.toLocaleString()} />
                <InfoRow label="HPV" value={data.dose_hpv?.toLocaleString()} />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>

        {/* Additional Information */}
        {/* {(data.remark || data.created_at) && (
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {data.remark && <InfoRow label="Remark" value={data.remark} />}
                {data.created_at && (
                  <InfoRow
                    label="Created"
                    value={new Date(data.created_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  />
                )}
                {data.updated_at && (
                  <InfoRow
                    label="Last Updated"
                    value={new Date(data.updated_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        )} */}
      </Grid>
    </Container>
  );
}
