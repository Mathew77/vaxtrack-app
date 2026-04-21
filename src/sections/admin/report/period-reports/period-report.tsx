import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VaxTable from '../../../../utils/VaxTablePage';
import { useFetchStates, useFetchLgas, useFetchWards, useFetchPeriodReport } from 'src/hooks/apis/report/report-hook';

type ReportConfig = {
  endpoint: string;
  queryKey: string;
  columns: { accessorKey: string; header: string; size: number }[];
  resolveData?: (response: any) => any[];
};

const REPORT_CONFIGS: Record<string, ReportConfig> = {
  'empty-vials-retrieved': {
    endpoint: 'v1/report/empty-vials-retrieved-report/',
    queryKey: 'empty-vials-retrieved-report',
    resolveData: (res) => res?.lga_level?.length ? res.lga_level : (res?.state_level ?? []),
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'bcg_empty_vials', header: 'BCG', size: 120 },
      { accessorKey: 'hepb_empty_vials', header: 'HepB', size: 120 },
      { accessorKey: 'bopv_empty_vials', header: 'bOPV', size: 120 },
      { accessorKey: 'penta_empty_vials', header: 'Penta', size: 120 },
      { accessorKey: 'pcv_empty_vials', header: 'PCV', size: 120 },
      { accessorKey: 'ipv_empty_vials', header: 'IPV', size: 120 },
      { accessorKey: 'mea_empty_vials', header: 'MEA', size: 120 },
      { accessorKey: 'yf_empty_vials', header: 'YF', size: 120 },
      { accessorKey: 'td_empty_vials', header: 'TD', size: 120 },
      { accessorKey: 'mena_empty_vials', header: 'MenA', size: 120 },
      { accessorKey: 'rota_empty_vials', header: 'Rota', size: 120 },
      { accessorKey: 'hpv_empty_vials', header: 'HPV', size: 120 },
      { accessorKey: 'mr_empty_vials', header: 'MR', size: 120 },
      { accessorKey: 'mal_empty_vials', header: 'MAL', size: 120 },
    ],
  },
  'syringes-by-lga': {
    endpoint: 'v1/report/syringes-received-by-lga/',
    queryKey: 'syringes-received-by-lga',
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: '0_05_ml', header: '0.05 ml', size: 130 },
      { accessorKey: '0_5_ml', header: '0.5 ml', size: 130 },
      { accessorKey: '2_ml', header: '2 ml', size: 120 },
      { accessorKey: '5_ml', header: '5 ml', size: 120 },
    ],
  },
  'empty-vials-by-lga': {
    endpoint: 'v1/report/empty-vials-by-lga/',
    queryKey: 'empty-vials-by-lga',
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'bcg_empty_vials', header: 'BCG', size: 120 },
      { accessorKey: 'hepb_empty_vials', header: 'HepB', size: 120 },
      { accessorKey: 'bopv_empty_vials', header: 'bOPV', size: 120 },
      { accessorKey: 'penta_empty_vials', header: 'Penta', size: 120 },
      { accessorKey: 'pcv_empty_vials', header: 'PCV', size: 120 },
      { accessorKey: 'ipv_empty_vials', header: 'IPV', size: 120 },
      { accessorKey: 'mea_empty_vials', header: 'MEA', size: 120 },
      { accessorKey: 'yf_empty_vials', header: 'YF', size: 120 },
      { accessorKey: 'td_empty_vials', header: 'TD', size: 120 },
      { accessorKey: 'mena_empty_vials', header: 'MenA', size: 120 },
      { accessorKey: 'rota_empty_vials', header: 'Rota', size: 120 },
      { accessorKey: 'hpv_empty_vials', header: 'HPV', size: 120 },
      { accessorKey: 'mr_empty_vials', header: 'MR', size: 120 },
      { accessorKey: 'mal_empty_vials', header: 'MAL', size: 120 },
    ],
  },
  'zero-stock-percentage': {
    endpoint: 'v1/report/zero-stock-percentage-by-lga/',
    queryKey: 'zero-stock-percentage-by-lga',
    resolveData: (res) => {
      const rows = Array.isArray(res) ? res : (res?.results ?? res?.data ?? res?.lga_level ?? []);
      return rows.map(({ facility_details, ...rest }: any) => rest);
    },
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'total_facilities', header: 'Total Facilities', size: 150 },
      { accessorKey: 'bcg_zero_stock_percent', header: 'BCG %', size: 120 },
      { accessorKey: 'hepb_zero_stock_percent', header: 'HepB %', size: 120 },
      { accessorKey: 'bopv_zero_stock_percent', header: 'bOPV %', size: 120 },
      { accessorKey: 'penta_zero_stock_percent', header: 'Penta %', size: 120 },
      { accessorKey: 'pcv_zero_stock_percent', header: 'PCV %', size: 120 },
      { accessorKey: 'ipv_zero_stock_percent', header: 'IPV %', size: 120 },
      { accessorKey: 'mea_zero_stock_percent', header: 'MEA %', size: 120 },
      { accessorKey: 'yf_zero_stock_percent', header: 'YF %', size: 120 },
      { accessorKey: 'td_zero_stock_percent', header: 'TD %', size: 120 },
      { accessorKey: 'mena_zero_stock_percent', header: 'MenA %', size: 120 },
      { accessorKey: 'rota_zero_stock_percent', header: 'Rota %', size: 120 },
      { accessorKey: 'hpv_zero_stock_percent', header: 'HPV %', size: 120 },
      { accessorKey: 'mr_zero_stock_percent', header: 'MR %', size: 120 },
      { accessorKey: 'mal_zero_stock_percent', header: 'MAL %', size: 120 },
    ],
  },
  'vaccine-antigen-by-lga': {
    endpoint: 'v1/report/vaccine-antigen-quantity-by-lga/',
    queryKey: 'vaccine-antigen-quantity-by-lga',
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'dose_bcg_received', header: 'BCG', size: 120 },
      { accessorKey: 'dose_hepb_received', header: 'HepB', size: 120 },
      { accessorKey: 'dose_bopv_received', header: 'bOPV', size: 120 },
      { accessorKey: 'dose_penta_received', header: 'Penta', size: 120 },
      { accessorKey: 'dose_pcv_received', header: 'PCV', size: 120 },
      { accessorKey: 'dose_ipv_received', header: 'IPV', size: 120 },
      { accessorKey: 'dose_mea_received', header: 'MEA', size: 120 },
      { accessorKey: 'dose_yf_received', header: 'YF', size: 120 },
      { accessorKey: 'dose_td_received', header: 'TD', size: 120 },
      { accessorKey: 'dose_mena_received', header: 'MenA', size: 120 },
      { accessorKey: 'dose_rota_received', header: 'Rota', size: 120 },
      { accessorKey: 'dose_hpv_received', header: 'HPV', size: 120 },
      { accessorKey: 'dose_mr_received', header: 'MR', size: 120 },
      { accessorKey: 'dose_mal_received', header: 'MAL', size: 120 },
    ],
  },
  'vaccine-antigen-received': {
    endpoint: 'v1/report/vaccine-antigen-quantity-received/',
    queryKey: 'vaccine-antigen-quantity-received',
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'ward', header: 'Ward', size: 150 },
      { accessorKey: 'ehf_name', header: 'Facility', size: 200 },
      { accessorKey: 'assigned_unique_id', header: 'Unique ID', size: 130 },
      { accessorKey: 'period', header: 'Period', size: 120 },
      { accessorKey: 'dose_bcg_received', header: 'BCG', size: 120 },
      { accessorKey: 'dose_hepb_received', header: 'HepB', size: 120 },
      { accessorKey: 'dose_bopv_received', header: 'bOPV', size: 120 },
      { accessorKey: 'dose_penta_received', header: 'Penta', size: 120 },
      { accessorKey: 'dose_pcv_received', header: 'PCV', size: 120 },
      { accessorKey: 'dose_ipv_received', header: 'IPV', size: 120 },
      { accessorKey: 'dose_mea_received', header: 'MEA', size: 120 },
      { accessorKey: 'dose_yf_received', header: 'YF', size: 120 },
      { accessorKey: 'dose_td_received', header: 'TD', size: 120 },
      { accessorKey: 'dose_mena_received', header: 'MenA', size: 120 },
      { accessorKey: 'dose_rota_received', header: 'Rota', size: 120 },
      { accessorKey: 'dose_hpv_received', header: 'HPV', size: 120 },
      { accessorKey: 'dose_mr_received', header: 'MR', size: 120 },
      { accessorKey: 'dose_mal_received', header: 'MAL', size: 120 },
    ],
  },
  'safety-boxes-retrieved': {
    endpoint: 'v1/report/srafety-boxes-retrieved-report/',
    queryKey: 'safety-boxes-retrieved-report',
    resolveData: (res) => Array.isArray(res) ? res : [],
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'ward', header: 'Ward', size: 150 },
      { accessorKey: 'ehf_name', header: 'Facility', size: 200 },
      { accessorKey: 'safty_box_empty', header: 'Safety Boxes Empty', size: 180 },
      { accessorKey: 'safty_box_filled', header: 'Safety Box Filled', size: 180 },
    ],
  },
  'non-functional-ehf': {
    endpoint: 'v1/report/non-functional-ehf-during-delivery/',
    queryKey: 'non-functional-ehf-during-delivery',
    resolveData: (res) => (res?.results ?? []).map(({ state, lga, ward, ehf_name, assigned_unique_id, period }: any) => ({ state, lga, ward, ehf_name, assigned_unique_id, period, status: 'Non Functional' })),
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'ward', header: 'Ward', size: 150 },
      { accessorKey: 'ehf_name', header: 'Facility', size: 200 },
      { accessorKey: 'assigned_unique_id', header: 'Unique ID', size: 130 },
      { accessorKey: 'period', header: 'Period', size: 120 },
      { accessorKey: 'status', header: 'Status', size: 160 },
    ],
  },
  'functional-ehf-vaccine-received': {
    endpoint: 'v1/report/functional-ehf-vaccine-received/',
    queryKey: 'functional-ehf-vaccine-received',
    resolveData: (res) => (res?.results ?? []).map(({ state, lga, ward, ehf_name, assigned_unique_id, period }: any) => ({ state, lga, ward, ehf_name, assigned_unique_id, period, status: 'Functional' })),
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'ward', header: 'Ward', size: 150 },
      { accessorKey: 'ehf_name', header: 'Facility', size: 200 },
      { accessorKey: 'assigned_unique_id', header: 'Unique ID', size: 130 },
      { accessorKey: 'period', header: 'Period', size: 120 },
      { accessorKey: 'status', header: 'Status', size: 160 },
    ],
  },
  'delivery-completed': {
    endpoint: 'v1/report/delivery-completed/',
    queryKey: 'delivery-completed',
    resolveData: (res) => res?.results ?? res?.data ?? (Array.isArray(res) ? res : []),
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'ward', header: 'Ward', size: 150 },
      { accessorKey: 'ehf_name', header: 'Facility', size: 200 },
      { accessorKey: 'assigned_unique_id', header: 'Unique ID', size: 130 },
      { accessorKey: 'period', header: 'Period', size: 120 },
      { accessorKey: 'dose_bcg_received', header: 'BCG', size: 100 },
      { accessorKey: 'dose_hepb_received', header: 'HepB', size: 100 },
      { accessorKey: 'dose_bopv_received', header: 'bOPV', size: 100 },
      { accessorKey: 'dose_penta_received', header: 'Penta', size: 100 },
      { accessorKey: 'dose_pcv_received', header: 'PCV', size: 100 },
      { accessorKey: 'dose_ipv_received', header: 'IPV', size: 100 },
      { accessorKey: 'dose_mea_received', header: 'MEA', size: 100 },
      { accessorKey: 'dose_yf_received', header: 'YF', size: 100 },
      { accessorKey: 'dose_td_received', header: 'TD', size: 100 },
      { accessorKey: 'dose_mena_received', header: 'MenA', size: 100 },
      { accessorKey: 'dose_rota_received', header: 'Rota', size: 100 },
      { accessorKey: 'dose_hpv_received', header: 'HPV', size: 100 },
      { accessorKey: 'dose_mr_received', header: 'MR', size: 100 },
      { accessorKey: 'dose_malaria_received', header: 'Malaria', size: 100 },
    ],
  },
  'vaccine-deficit': {
    endpoint: 'v1/report/vaccine-deficit/',
    queryKey: 'vaccine-deficit',
    resolveData: (res) => res?.results ?? res?.data ?? (Array.isArray(res) ? res : []),
    columns: [
      { accessorKey: 'state', header: 'State', size: 150 },
      { accessorKey: 'lga', header: 'LGA', size: 150 },
      { accessorKey: 'ward', header: 'Ward', size: 150 },
      { accessorKey: 'ehf_name', header: 'Facility', size: 200 },
      { accessorKey: 'assigned_unique_id', header: 'Unique ID', size: 130 },
      { accessorKey: 'period', header: 'Period', size: 120 },
      { accessorKey: 'dose_bcg_received', header: 'BCG', size: 100 },
      { accessorKey: 'dose_hepb_received', header: 'HepB', size: 100 },
      { accessorKey: 'dose_bopv_received', header: 'bOPV', size: 100 },
      { accessorKey: 'dose_penta_received', header: 'Penta', size: 100 },
      { accessorKey: 'dose_pcv_received', header: 'PCV', size: 100 },
      { accessorKey: 'dose_ipv_received', header: 'IPV', size: 100 },
      { accessorKey: 'dose_mea_received', header: 'MEA', size: 100 },
      { accessorKey: 'dose_yf_received', header: 'YF', size: 100 },
      { accessorKey: 'dose_td_received', header: 'TD', size: 100 },
      { accessorKey: 'dose_mena_received', header: 'MenA', size: 100 },
      { accessorKey: 'dose_rota_received', header: 'Rota', size: 100 },
      { accessorKey: 'dose_hpv_received', header: 'HPV', size: 100 },
      { accessorKey: 'dose_mr_received', header: 'MR', size: 100 },
      { accessorKey: 'dose_malaria_received', header: 'Malaria', size: 100 },
    ],
  },
};

interface PeriodReportProps {
  reportType: string;
}

const PeriodReport: React.FC<PeriodReportProps> = ({ reportType }) => {
  const config = REPORT_CONFIGS[reportType];

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedLga, setSelectedLga] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [periodFrom, setPeriodFrom] = useState<string>('');
  const [periodTo, setPeriodTo] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const { data: states = [], isLoading: statesLoading } = useFetchStates();
  const { data: lgas = [], isLoading: lgasLoading } = useFetchLgas(selectedState);
  const { data: wards = [], isLoading: wardsLoading } = useFetchWards(selectedLga);
  const { data: reportData, isLoading: reportLoading } = useFetchPeriodReport(
    config?.endpoint ?? '',
    config?.queryKey ?? reportType,
    selectedState,
    periodFrom,
    periodTo,
    selectedLga,
    selectedWard,
    hasSearched
  );

  const userRole = sessionStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';
  const isSlwg = userRole === 'slwg';
  const isScs = userRole === 'scs';
  const scs_list = JSON.parse(sessionStorage.getItem('scs_list') || '[]') as string[];

  useEffect(() => {
    setSelectedState('');
    setSelectedLga('');
    setSelectedWard('');
    setPeriodFrom('');
    setPeriodTo('');
    setHasSearched(false);
  }, [reportType]);

  useEffect(() => {
    if ((isSlwg || isScs) && states.length > 0 && scs_list.length > 0 && !selectedState) {
      const userState = states.find((state: any) => scs_list.includes(String(state.id)));
      if (userState) {
        setSelectedState(userState.state);
      }
    }
  }, [states, isSlwg, isScs, scs_list]);

  const handleStateChange = (event: any) => {
    setSelectedState(event.target.value);
    setSelectedLga('');
    setSelectedWard('');
    setHasSearched(false);
  };

  const handleLgaChange = (event: any) => {
    setSelectedLga(event.target.value);
    setSelectedWard('');
    setHasSearched(false);
  };

  const handleWardChange = (event: any) => {
    setSelectedWard(event.target.value);
    setHasSearched(false);
  };

  const handleSearch = () => {
    setHasSearched(true);
  };

  const clearFilters = () => {
    setSelectedLga('');
    setSelectedWard('');
    setPeriodFrom('');
    setPeriodTo('');
    setHasSearched(false);
    if (isAdmin) setSelectedState('');
  };

  const columns = useMemo(() => config?.columns ?? [], [reportType]);

  const filterControls = (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id="state-select-label">State</InputLabel>
            <Select
              labelId="state-select-label"
              value={selectedState}
              label="State"
              onChange={handleStateChange}
              disabled={statesLoading}
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>
              {isAdmin && (
                <MenuItem value="all-states">
                  <strong>All States</strong>
                </MenuItem>
              )}
              {states
                .filter((state: any) => {
                  if (isAdmin) return true;
                  if (isSlwg || isScs) return scs_list.includes(String(state.id));
                  return false;
                })
                .map((state: any) => (
                  <MenuItem
                    key={state.id ?? state.state}
                    value={state.state ?? state.value ?? state.name}
                  >
                    {state.state ?? state.value ?? state.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id="lga-select-label">LGA</InputLabel>
            <Select
              labelId="lga-select-label"
              value={selectedLga}
              label="LGA"
              onChange={handleLgaChange}
              disabled={!selectedState || selectedState === 'all-states' || lgasLoading}
            >
              <MenuItem value="">
                <em>All LGAs</em>
              </MenuItem>
              {lgas.map((lga: any) => (
                <MenuItem key={lga.id ?? lga.lga} value={lga.name ?? lga.lga}>
                  {lga.name ?? lga.lga}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id="ward-select-label">Ward</InputLabel>
            <Select
              labelId="ward-select-label"
              value={selectedWard}
              label="Ward"
              onChange={handleWardChange}
              disabled={!selectedLga || wardsLoading}
            >
              <MenuItem value="">
                <em>All Wards</em>
              </MenuItem>
              {wards.map((ward: any) => (
                <MenuItem key={ward.id ?? ward.ward} value={ward.name ?? ward.ward}>
                  {ward.name ?? ward.ward}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <TextField
            fullWidth
            size="small"
            label="Period From"
            type="date"
            value={periodFrom}
            onChange={(e) => { setPeriodFrom(e.target.value); setHasSearched(false); }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <TextField
            fullWidth
            size="small"
            label="Period To"
            type="date"
            value={periodTo}
            onChange={(e) => { setPeriodTo(e.target.value); setHasSearched(false); }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!selectedState}
            startIcon={<SearchIcon />}
            fullWidth
            sx={{
              height: '40px',
              backgroundColor: '#2c3e50',
              '&:hover': { backgroundColor: '#34495e' },
            }}
          >
            Search
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={1.5}>
          <Button
            variant="outlined"
            color="error"
            onClick={clearFilters}
            fullWidth
            sx={{ height: '40px' }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: '16px' }}>
        <Typography variant="body2" color="textSecondary">
          {!hasSearched ? (
            'Please select a state and click Search to view data'
          ) : (
            <>
              {`Showing ${config?.resolveData ? config.resolveData(reportData).length : (reportData?.data?.length ?? reportData?.results?.length ?? 0)} records`}
              {selectedLga && ` | LGA: ${selectedLga}`}
              {selectedWard && ` | Ward: ${selectedWard}`}
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      <VaxTable
        columns={columns}
        data={hasSearched ? (config?.resolveData ? config.resolveData(reportData) : (reportData?.data ?? reportData?.results ?? [])) : []}
        tableHeader=""
        customRightButton={false}
        extraComponents={filterControls}
        showDownloadButton={true}
        loading={reportLoading}
      />
    </Box>
  );
};

export default PeriodReport;
