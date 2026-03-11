import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Paper,
  Skeleton,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Divider,
  Slide
} from '@mui/material';
import { Add, Remove, Close } from '@mui/icons-material';
import { useFetchSlwgDashboard } from 'src/hooks/apis/dashboards/slwg/slwg-dashboard-hook';
import type { SlwgDashboardWardType } from 'src/hooks/apis/dashboards/slwg/slwg-dashboard-type';

interface LGAGroupedData {
  lga: string;
  state: string;
  wards: SlwgDashboardWardType[];
  totalVaccines: { [key: string]: number };
  totalReceived: { [key: string]: number };
  totalPhysicalStock: { [key: string]: number };
}

interface VaccineDetailData {
  vaccine: string;
  location: string;
  locationType: 'LGA' | 'Ward' | 'Facility';
  actualStock: number;
  allocatedStock: number;
  percentage: string;
  status: string;
  facilityName?: string;
}

const VaccineStockTable = () => {
  const [expandedLGAs, setExpandedLGAs] = useState<Record<string, boolean>>({});
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVaccineDetail, setSelectedVaccineDetail] = useState<VaccineDetailData | null>(null);
  const { data, isLoading, error } = useFetchSlwgDashboard();

  // Stock status colors
  const stockColors = {
    stockOut: '#F44336',
    belowMinimum: '#E8753A',
    reorder: '#F4C542',
    adequate: '#43A047',
    overstocked: '#1565C0',
  };

  const getStockStatus = (received: number, physicalStock: number, maximum: number) => {
    if (maximum <= 0) return stockColors.stockOut;
    const percentage = ((received + physicalStock) / maximum) * 100;
    if (percentage === 0) return stockColors.stockOut;
    if (percentage <= 25) return stockColors.belowMinimum;
    if (percentage <= 49) return stockColors.reorder;
    if (percentage <= 124) return stockColors.adequate;
    return stockColors.overstocked;
  };

  const getStockStatusLabel = (received: number, physicalStock: number, maximum: number) => {
    if (maximum <= 0) return 'Out of Stock';
    const percentage = ((received + physicalStock) / maximum) * 100;
    if (percentage === 0) return 'Out of Stock';
    if (percentage <= 25) return 'Below Minimum Stock';
    if (percentage <= 49) return 'Re-order Level';
    if (percentage <= 124) return 'Stock Adequate';
    return 'Over Stock';
  };

  const vaccines = ['BCG', 'BOPV', 'HPV', 'HEPB', 'IPV', 'MEASLES', 'MENA', 'MR', 'PCV', 'PENTA', 'ROTA', 'TD', 'YF'];

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  };

  const toggleLGA = (lga: string) => {
    setExpandedLGAs(prev => ({
      ...prev,
      [lga]: !prev[lga]
    }));
  };

  const toggleWard = (ward: string) => {
    setExpandedWards(prev => ({
      ...prev,
      [ward]: !prev[ward]
    }));
  };

  const handleVaccineClick = (vaccineDetail: VaccineDetailData) => {
    setSelectedVaccineDetail(vaccineDetail);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Map vaccine names to API field names
  const vaccineFieldMap: Record<string, string> = {
    'BCG': 'dose_bcg',
    'BOPV': 'dose_bopv',
    'HPV': 'dose_hpv',
    'HEPB': 'dose_hepb',
    'IPV': 'dose_ipv',
    'MEASLES': 'dose_mea',
    'MENA': 'dose_mena',
    'MR': 'mr',
    'PCV': 'dose_pcv',
    'PENTA': 'dose_penta',
    'ROTA': 'dose_rota',
    'TD': 'dose_td',
    'YF': 'dose_yf'
  };

  // Physical stock field map
  const physicalStockFieldMap: Record<string, string> = {
    'BCG': 'bcg_physical_stock_balance',
    'BOPV': 'bopv_physical_stock_balance',
    'HPV': 'hpv_physical_stock_balance',
    'HEPB': 'hepb_physical_stock_balance',
    'IPV': 'ipv_physical_stock_balance',
    'MEASLES': 'mea_physical_stock_balance',
    'MENA': 'mena_physical_stock_balance',
    'MR': 'mr_physical_stock_balance',
    'PCV': 'pcv_physical_stock_balance',
    'PENTA': 'penta_physical_stock_balance',
    'ROTA': 'rota_physical_stock_balance',
    'TD': 'td_physical_stock_balance',
    'YF': 'yf_physical_stock_balance',
  };

  // Group data by LGA and calculate totals
  const groupedByLGA = useMemo(() => {
    if (!data) return [];

    const lgaMap: Record<string, LGAGroupedData> = {};

    data.forEach(wardData => {
      if (!lgaMap[wardData.lga]) {
        lgaMap[wardData.lga] = {
          lga: wardData.lga,
          state: wardData.state,
          wards: [],
          totalVaccines: {},
          totalReceived: {},
          totalPhysicalStock: {},
        };
      }

      lgaMap[wardData.lga].wards.push(wardData);

      Object.keys(vaccineFieldMap).forEach(vaccine => {
        const fieldName = vaccineFieldMap[vaccine];
        const receivedFieldName = `${fieldName}_received`;
        const physicalFieldName = physicalStockFieldMap[vaccine];

        const maximum = (wardData.sum_of_vaccine_at_ward_level as any)[fieldName] ?? 0;
        const received = (wardData.sum_of_vaccine_at_ward_level as any)[receivedFieldName] ?? 0;
        const physical = (wardData.sum_of_vaccine_at_ward_level as any)[physicalFieldName] ?? 0;

        lgaMap[wardData.lga].totalVaccines[vaccine] = (lgaMap[wardData.lga].totalVaccines[vaccine] || 0) + maximum;
        lgaMap[wardData.lga].totalReceived[vaccine] = (lgaMap[wardData.lga].totalReceived[vaccine] || 0) + received;
        lgaMap[wardData.lga].totalPhysicalStock[vaccine] = (lgaMap[wardData.lga].totalPhysicalStock[vaccine] || 0) + physical;
      });
    });

    return Object.values(lgaMap);
  }, [data]);

  if (isLoading) {
    return (
      <Box>
        <Card sx={{ mb: 3, p: 2.5 }}>
          <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" width={100} height={40} />
            ))}
          </Box>
        </Card>
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="error">
          {error ? 'Error loading dashboard data' : 'No data available'}
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {/* Legend */}
      <Card sx={{ mb: 3, p: 2, boxShadow: 2, borderRadius: 2, bgcolor: 'white' }}>
        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2, color: 'text.primary' }}>
          Stock Status Indicators
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.stockOut, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Out of Stock</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>=0%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.belowMinimum, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Below Minimum Stock</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>1 - 25%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.reorder, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Re-order Level</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>26 - 49%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.adequate, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Stock Adequate</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>50 - 124%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.overstocked, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Over Stock</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>&gt;125%</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Table */}
      <Box sx={{ position: 'relative' }}>
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2, maxHeight: 600 }}>
        <Table stickyHeader sx={{ minWidth: 1200, borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  bgcolor: 'grey.300',
                  fontWeight: 600,
                  borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                  borderBottom: '0.5px solid rgba(255, 255, 255, 0.3)',
                  width: '200px',
                  minWidth: '200px',
                  position: 'sticky',
                  left: 0,
                  zIndex: 3
                }}
              >
                LOCATION
              </TableCell>
              {vaccines.map(vaccine => (
                <TableCell
                  key={vaccine}
                  align="center"
                  sx={{
                    bgcolor: 'grey.300',
                    fontWeight: 600,
                    borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                    borderBottom: '0.5px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '0.75rem',
                    width: '100px',
                    minWidth: '100px'
                  }}
                >
                  {vaccine}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* LGA Rows */}
            {groupedByLGA.map((lgaData) => (
              <>
                {/* LGA Row */}
                <TableRow
                  key={lgaData.lga}
                  sx={{
                    '&:hover td:first-of-type': { bgcolor: 'grey.50' }
                  }}
                >
                  <TableCell
                    onClick={() => toggleLGA(lgaData.lga)}
                    sx={{
                      borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                      borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                      position: 'sticky',
                      left: 0,
                      bgcolor: 'white',
                      zIndex: 1,
                      cursor: 'pointer'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          p: 0.25,
                          border: '1px solid',
                          borderColor: 'grey.400',
                          borderRadius: '50%',
                          width: 20,
                          height: 20
                        }}
                      >
                        {expandedLGAs[lgaData.lga] ? <Remove sx={{ fontSize: 14 }} /> : <Add sx={{ fontSize: 14 }} />}
                      </IconButton>
                      <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.8rem' }}>
                        {lgaData.lga} LGA
                      </Typography>
                    </Box>
                  </TableCell>
                  {vaccines.map(vaccine => {
                    const maximum = lgaData.totalVaccines[vaccine] || 0;
                    const received = lgaData.totalReceived[vaccine] || 0;
                    const physical = lgaData.totalPhysicalStock[vaccine] || 0;
                    const percentage = maximum > 0 ? (((received + physical) / maximum) * 100).toFixed(1) : '0';
                    return (
                      <Tooltip
                        key={vaccine}
                        title={
                          <Box sx={{ p: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>{vaccine}</Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>Maximum: {formatNumber(maximum)}</Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>Actual (SOH + Received): {formatNumber(received + physical)}</Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>Percentage: {percentage}%</Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                              {getStockStatusLabel(received, physical, maximum)}
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <TableCell
                          align="center"
                          onClick={() => handleVaccineClick({
                            vaccine,
                            location: lgaData.lga,
                            locationType: 'LGA',
                            actualStock: maximum,
                            allocatedStock: received + physical,
                            percentage,
                            status: getStockStatusLabel(received, physical, maximum)
                          })}
                          sx={{
                            fontWeight: 700,
                            color: 'white',
                            bgcolor: getStockStatus(received, physical, maximum),
                            borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                            borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              opacity: 0.85,
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          {formatNumber(received + physical)}
                        </TableCell>
                      </Tooltip>
                    );
                  })}
                </TableRow>

                {/* Ward Rows */}
                {expandedLGAs[lgaData.lga] && lgaData.wards.map((wardData) => (
                  <>
                    <TableRow
                      key={`${lgaData.lga}-${wardData.ward}`}
                      sx={{
                        bgcolor: 'grey.50',
                        '&:hover td:first-of-type': { bgcolor: 'grey.100' }
                      }}
                    >
                      <TableCell
                        onClick={() => toggleWard(`${lgaData.lga}-${wardData.ward}`)}
                        sx={{
                          borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                          borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          left: 0,
                          bgcolor: 'grey.50',
                          zIndex: 1,
                          cursor: 'pointer'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 4 }}>
                          <IconButton
                            size="small"
                            sx={{
                              p: 0.25,
                              border: '1px solid',
                              borderColor: 'grey.400',
                              borderRadius: '50%',
                              width: 20,
                              height: 20
                            }}
                          >
                            {expandedWards[`${lgaData.lga}-${wardData.ward}`] ? <Remove sx={{ fontSize: 14 }} /> : <Add sx={{ fontSize: 14 }} />}
                          </IconButton>
                          <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.75rem' }}>
                            {wardData.ward} Ward
                          </Typography>
                        </Box>
                      </TableCell>
                      {vaccines.map(vaccine => {
                        const fieldName = vaccineFieldMap[vaccine];
                        const physicalFieldName = physicalStockFieldMap[vaccine];
                        const maximum = (wardData.sum_of_vaccine_at_ward_level as any)[fieldName] ?? 0;
                        const received = (wardData.sum_of_vaccine_at_ward_level as any)[`${fieldName}_received`] ?? 0;
                        const physical = (wardData.sum_of_vaccine_at_ward_level as any)[physicalFieldName] ?? 0;
                        const percentage = maximum > 0 ? (((received + physical) / maximum) * 100).toFixed(1) : '0';
                        return (
                          <Tooltip
                            key={vaccine}
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>{vaccine}</Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>Maximum: {formatNumber(maximum)}</Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>Actual (SOH + Received): {formatNumber(received + physical)}</Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>Percentage: {percentage}%</Typography>
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                                  {getStockStatusLabel(received, physical, maximum)}
                                </Typography>
                              </Box>
                            }
                            arrow
                            placement="top"
                          >
                            <TableCell
                              align="center"
                              onClick={() => handleVaccineClick({
                                vaccine,
                                location: wardData.ward,
                                locationType: 'Ward',
                                actualStock: maximum,
                                allocatedStock: received + physical,
                                percentage,
                                status: getStockStatusLabel(received, physical, maximum)
                              })}
                              sx={{
                                fontWeight: 600,
                                color: 'white',
                                bgcolor: getStockStatus(received, physical, maximum),
                                borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                                borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  opacity: 0.85,
                                  transform: 'scale(1.05)'
                                }
                              }}
                            >
                              {formatNumber(received + physical)}
                            </TableCell>
                          </Tooltip>
                        );
                      })}
                    </TableRow>

                    {/* Facility Rows */}
                    {expandedWards[`${lgaData.lga}-${wardData.ward}`] && wardData.facilities.map((facility) => (
                      <TableRow
                        key={facility.id}
                        sx={{
                          bgcolor: 'grey.100',
                          '&:hover': { bgcolor: 'grey.200' }
                        }}
                      >
                        <TableCell
                          sx={{
                            borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                            borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                            position: 'sticky',
                            left: 0,
                            bgcolor: 'grey.100',
                            zIndex: 1
                          }}
                        >
                          <Box sx={{ pl: 6 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {facility.name_of_ehf}
                            </Typography>
                          </Box>
                        </TableCell>
                        {vaccines.map(vaccine => {
                          const fieldName = vaccineFieldMap[vaccine];
                          const physicalFieldName = physicalStockFieldMap[vaccine];
                          const maximum = (facility as any)[fieldName] ?? 0;
                          const received = (facility as any)[`${fieldName}_received`] ?? 0;
                          const physical = (facility as any)[physicalFieldName] ?? 0;
                          const percentage = maximum > 0 ? (((received + physical) / maximum) * 100).toFixed(1) : '0';
                          return (
                            <Tooltip
                              key={vaccine}
                              title={
                                <Box sx={{ p: 0.5 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>{vaccine} - {facility.name_of_ehf}</Typography>
                                    <Typography variant="caption" sx={{ display: 'block' }}>Maximum: {formatNumber(maximum)}</Typography>
                                  <Typography variant="caption" sx={{ display: 'block' }}>Actual (SOH + Received): {formatNumber(received + physical)}</Typography>
                                  <Typography variant="caption" sx={{ display: 'block' }}>Percentage: {percentage}%</Typography>
                                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                                    {getStockStatusLabel(received, physical, maximum)}
                                  </Typography>
                                </Box>
                              }
                              arrow
                              placement="top"
                            >
                              <TableCell
                                align="center"
                                onClick={() => handleVaccineClick({
                                  vaccine,
                                  location: wardData.ward,
                                  locationType: 'Facility',
                                  actualStock: maximum,
                                  allocatedStock: received + physical,
                                  percentage,
                                  status: getStockStatusLabel(received, physical, maximum),
                                  facilityName: facility.name_of_ehf
                                })}
                                sx={{
                                  fontWeight: 500,
                                  color: 'white',
                                  bgcolor: getStockStatus(received, physical, maximum),
                                  borderRight: '0.5px solid rgba(255, 255, 255, 0.3)',
                                  borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    opacity: 0.85,
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              >
                                {formatNumber(received + physical)}
                              </TableCell>
                            </Tooltip>
                          );
                        })}
                      </TableRow>
                    ))}
                  </>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Side Panel for Vaccine Details */}
      {/* <Slide direction="left" in={drawerOpen} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 350,
            height: 600,
            maxHeight: '100%',
            boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.15)',
            borderRadius: 2,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
        > */}
          {/* {selectedVaccineDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}> */}
              {/* Header */}
              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1rem' }}>
                  Vaccine Details
                </Typography>
                <IconButton onClick={handleCloseDrawer} size="small">
                  <Close sx={{ fontSize: 18 }} />
                </IconButton>
              </Box> */}

              {/* Content */}
              {/* <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}> */}
                {/* Vaccine Info */}
                {/* <Box sx={{ mb: 2 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                    VACCINE TYPE
                  </Typography>
                  <Typography variant="h6" fontWeight="700" sx={{ mt: 0.5, mb: 1.5, fontSize: '1.25rem' }}>
                    {selectedVaccineDetail.vaccine}
                  </Typography>

                  <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                    LOCATION
                  </Typography>
                  <Typography variant="body2" fontWeight="600" sx={{ mt: 0.5, fontSize: '0.875rem' }}>
                    {selectedVaccineDetail.location} {selectedVaccineDetail.locationType}
                  </Typography>
                  {selectedVaccineDetail.facilityName && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: 'block', fontSize: '0.7rem' }}>
                      {selectedVaccineDetail.facilityName}
                    </Typography>
                  )}
                </Box> */}

                {/* <Divider sx={{ my: 1.5 }} /> */}

                {/* Stock Summary */}
                {/* <Box sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1, fontSize: '0.75rem' }}>
                    Stock Summary
                  </Typography>

                  <Card sx={{ p: 1.25, mb: 1, bgcolor: 'grey.50', boxShadow: 'none', border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3, fontSize: '0.65rem' }}>
                      Actual Stock
                    </Typography>
                    <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.5rem' }}>
                      {formatNumber(selectedVaccineDetail.actualStock)}
                    </Typography>
                  </Card>

                  <Card sx={{ p: 1.25, mb: 1, bgcolor: 'grey.50', boxShadow: 'none', border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3, fontSize: '0.65rem' }}>
                      Allocated Stock
                    </Typography>
                    <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.5rem' }}>
                      {formatNumber(selectedVaccineDetail.allocatedStock)}
                    </Typography>
                  </Card>

                  <Card sx={{ p: 1.25, mb: 1, bgcolor: 'grey.50', boxShadow: 'none', border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3, fontSize: '0.65rem' }}>
                      Allocation Percentage
                    </Typography>
                    <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.5rem' }}>
                      {selectedVaccineDetail.percentage}%
                    </Typography>
                  </Card>
                </Box> */}

                {/* <Divider sx={{ my: 1.5 }} /> */}

                {/* Status */}
                {/* <Box>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1, fontSize: '0.75rem' }}>
                    Stock Status
                  </Typography>
                  <Card
                    sx={{
                      p: 1.25,
                      bgcolor: getStockStatus(selectedVaccineDetail.actualStock, selectedVaccineDetail.allocatedStock),
                      color: 'white',
                      boxShadow: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.8rem' }}>
                      {selectedVaccineDetail.status}
                    </Typography>
                  </Card>
                </Box> */}
              {/* </Box> */}
            {/* </Box>
          )} */}
        {/* </Paper>
      </Slide> */}
      </Box>
    </Box>
  );
};

export default VaccineStockTable;
