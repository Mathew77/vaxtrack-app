import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../../utils/VaxTablePage';
import { useFetchStates, useFetchLgas, /* useFetchWards, */ useFetchStockOutReport } from 'src/hooks/apis/report/report-hook';
import SearchIcon from '@mui/icons-material/Search';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box paddingY={1}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const StockOutReport: React.FC = () => {
  const [value, setValue] = React.useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedLga, setSelectedLga] = useState<string>('');
  // const [selectedWard, setSelectedWard] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const { data: states = [], isLoading: statesLoading } = useFetchStates();
  const { data: lgas = [], isLoading: lgasLoading } = useFetchLgas(selectedState);
  // const { data: wards = [], isLoading: wardsLoading } = useFetchWards(selectedLga);
  const { data: reportData, isLoading: reportLoading } = useFetchStockOutReport(
    selectedState,
    selectedLga,
    undefined,
    hasSearched
  );


  const userRole = sessionStorage.getItem('userRole');

  const isAdmin= userRole === 'admin';
  const isSlwg = userRole === 'slwg';
  const isScs = userRole === 'scs';

    
  const scs_list = JSON.parse(sessionStorage.getItem('scs_list') || '[]') as string[];

   useEffect(() => {
    if ((isSlwg || isScs) && states.length > 0 && scs_list.length > 0 && !selectedState) {
        const userState = states.find((state: any) =>
        scs_list.includes(String(state.id))
        );
        if (userState) {
        const stateValue = userState.state;
        setSelectedState(stateValue);
        }
    }
    }, [states, isSlwg, isScs, scs_list]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleStateChange = (event: any) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setSelectedLga('');
    setHasSearched(false); 
    // setSelectedWard('');
  };

  const handleLgaChange = (event: any) => {
    const newLga = event.target.value;
    setSelectedLga(newLga);
    setHasSearched(false); 
    // setSelectedWard('');
  };

  // const handleWardChange = (event: any) => {
  //   setSelectedWard(event.target.value);
  // };

  const handleSearch = () => {
    setHasSearched(true);
  };

  const clearFilters = () => {
    setSelectedLga('');
    // setSelectedWard('');
    setHasSearched(false);

    if (isAdmin) {
        setSelectedState('');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'state',
        header: 'State',
        size: 150,
      },
      {
        accessorKey: 'lga',
        header: 'LGA',
        size: 150,
      },
      // {
      //   accessorKey: 'ward',
      //   header: 'Ward',
      //   size: 150,
      // },
      {
        accessorKey: 'facility',
        header: 'Facility',
        size: 200,
      },
      {
        accessorKey: 'facility_type',
        header: 'Facility Type',
        size: 120,
      },
      {
        accessorKey: 'vaccine',
        header: 'Vaccine',
        size: 120,
      },
      {
        accessorKey: 'physical_stock',
        header: 'Physical Stock',
        size: 130,
      },
      {
        accessorKey: 'stock_out',
        header: 'Stock Out',
        size: 100,
      },
      {
        accessorKey: 'created_date',
        header: 'Created Date',
        size: 180,
        Cell: ({ cell }: any) => {
          const date = new Date(cell.getValue());
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
      },
    ],
    []
  );

  const FilterControls = () => (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
      {/* <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 600 }}>
        Filter Options
      </Typography> */}
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id="state-select-label">State</InputLabel>
            <Select
                labelId="state-select-label"
                id="state-select"
                value={selectedState}
                label="State"
                onChange={handleStateChange}
                disabled={statesLoading} 
            >
                <MenuItem value="">
                <em>Select State</em>
                </MenuItem>

                {/* Only show "All States" to admin */}
                {isAdmin && (
                <MenuItem value="all-states">
                    <strong>All States</strong>
                </MenuItem>
                )}

                {/* Filter states based on role */}
                {states
                .filter((state: any) => {
                    if (isAdmin) return true; 
                    if (isSlwg || isScs) {
                    const stateId = String(state.id);
                    return scs_list.includes(stateId); 
                    }
                    return false; 
                })
                .map((state: any) => (
                    <MenuItem
                    key={state.id ?? state.value ?? state.name}
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
              id="lga-select"
              value={selectedLga}
              label="LGA"
              onChange={handleLgaChange}
              disabled={!selectedState || selectedState === 'all-states' || lgasLoading}
            >
              <MenuItem value="">
                <em>All LGAs</em>
              </MenuItem>
              {lgas.map((lga: any) => (
                <MenuItem key={lga.id ?? lga.lga ?? lga.name} value={lga.name ?? lga.lga}>
                  {lga.name ?? lga.lga}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id="ward-select-label">Ward</InputLabel>
            <Select
              labelId="ward-select-label"
              id="ward-select"
              value={selectedWard}
              label="Ward"
              onChange={handleWardChange}
              disabled={!selectedLga || selectedState === 'all-states' || wardsLoading}
            >
              <MenuItem value="">
                <em>All Wards</em>
              </MenuItem>
              {wards.map((ward: any) => (
                <MenuItem key={ward.id ?? ward.name} value={ward.name ?? ward.ward}>
                  {ward.name ?? ward.ward}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}

        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!selectedState}
            startIcon={<SearchIcon />}
            fullWidth
            sx={{ 
              height: '40px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }}
          >
            Search
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearFilters}
              fullWidth
              sx={{ height: '40px' }}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: '16px' }}>
        <Typography variant="body2" color="textSecondary">
          {!hasSearched ? (
            "Please select a state and click Search to view data"
          ) : (
            <>
              {`Showing ${reportData?.data?.length || 0} of ${reportData?.count || 0} records`}
              {selectedLga && ` | LGA: ${selectedLga}`}
              {/* {selectedWard && ` | Ward: ${selectedWard}`} */}
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={hasSearched ? (reportData?.data || []) : []}
            tableHeader=""
            customRightButton={false}
            extraComponents={<FilterControls />}
            headerStyles={{
              backgroundColor: '#1976D2',
              color: 'white',
              fontSize: '16px',
            }}
            showDownloadButton={true}
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default StockOutReport;