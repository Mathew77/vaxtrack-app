import { useState } from 'react';
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
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useFetchMccoDashboard } from 'src/hooks/apis/dashboards/mcco/mcco-dashboard-hook';

const MccoVaccineStockTable = () => {
  const [expandedEHFs, setExpandedEHFs] = useState<Record<string, boolean>>({});
  const { data, isLoading, error } = useFetchMccoDashboard();

  // Stock status colors
  const stockColors = {
    stockOut: '#F44336',
    belowMinimum: '#E8753A',
    reorder: '#F4C542',
    adequate: '#43A047',
    overStock: '#1565C0',
  };

  // Formula: ((received + physicalStock) / maximum) * 100
  const getStockStatus = (received: number, physicalStock: number, maximum: number) => {
    if (maximum <= 0) return stockColors.stockOut;
    const percentage = ((received + physicalStock) / maximum) * 100;
    if (percentage === 0) return stockColors.stockOut;
    if (percentage <= 25) return stockColors.belowMinimum;
    if (percentage <= 49) return stockColors.reorder;
    if (percentage <= 124) return stockColors.adequate;
    return stockColors.overStock;
  };

  const getStockStatusLabel = (received: number, physicalStock: number, maximum: number) => {
    if (maximum <= 0) return 'Out of Stock (0%)';
    const percentage = ((received + physicalStock) / maximum) * 100;
    if (percentage === 0) return `Out of Stock (0%)`;
    if (percentage <= 25) return `Below Minimum (${percentage.toFixed(1)}%)`;
    if (percentage <= 49) return `Re-order Level (${percentage.toFixed(1)}%)`;
    if (percentage <= 124) return `Stock Adequate (${percentage.toFixed(1)}%)`;
    return `Over Stock (${percentage.toFixed(1)}%)`;
  };

  const vaccines = ['BCG', 'BOPV', 'HPV', 'HEPB', 'IPV', 'MEASLES', 'MENA', 'MR', 'PCV', 'PENTA', 'ROTA', 'TD', 'YF'];

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  };

  const toggleEHF = (ehfKey: string) => {
    setExpandedEHFs(prev => ({
      ...prev,
      [ehfKey]: !prev[ehfKey]
    }));
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
    'PCV': 'dose_pcv',
    'PENTA': 'dose_penta',
    'ROTA': 'dose_rota',
    'TD': 'dose_td',
    'YF': 'dose_yf',
    'MR': 'dose_mr',
  };

  const physicalStockFieldMap: Record<string, string> = {
    'BCG': 'bcg_physical_stock_balance',
    'BOPV': 'bopv_physical_stock_balance',
    'HPV': 'hpv_physical_stock_balance',
    'HEPB': 'hepb_physical_stock_balance',
    'IPV': 'ipv_physical_stock_balance',
    'MEASLES': 'mea_physical_stock_balance',
    'MENA': 'mena_physical_stock_balance',
    'PCV': 'pcv_physical_stock_balance',
    'PENTA': 'penta_physical_stock_balance',
    'ROTA': 'rota_physical_stock_balance',
    'TD': 'td_physical_stock_balance',
    'YF': 'yf_physical_stock_balance',
    'MR': 'mr_physical_stock_balance',
  };

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
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>0%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.belowMinimum, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Below Minimum</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>1% – 25%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.reorder, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Re-order Level</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>26% – 49%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.adequate, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Stock Adequate</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>50% – 124%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.overStock, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Over Stock</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>≥ 125%</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Main Table */}
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
              {vaccines.map((vaccine) => (
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
            {data.map((ehf, ehfIndex) => {
              const ehfKey = ehf.assigned_unique_id || `ehf-${ehfIndex}`;
              const isEHFExpanded = expandedEHFs[ehfKey];

              return (
                <>
                  {/* EHF Row */}
                  <TableRow
                    key={ehfKey}
                    sx={{
                      '&:hover td:first-of-type': { bgcolor: 'grey.50' }
                    }}
                  >
                    <TableCell
                      onClick={() => toggleEHF(ehfKey)}
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
                          {isEHFExpanded ? <Remove sx={{ fontSize: 14 }} /> : <Add sx={{ fontSize: 14 }} />}
                        </IconButton>
                        <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.8rem' }}>
                          {ehf.ehf_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    {vaccines.map((vaccine) => {
                      const fieldName = vaccineFieldMap[vaccine];
                      const physicalStockFieldName = physicalStockFieldMap[vaccine];
                      const maximum = (ehf.sum_of_vaccine_at_ehf_level as any)[fieldName] || 0;
                      const received = (ehf.sum_of_vaccine_at_ehf_level as any)[`${fieldName}_received`] || 0;
                      const physicalStock = (ehf.sum_of_vaccine_at_ehf_level as any)[physicalStockFieldName] || 0;
                      const bgColor = getStockStatus(received, physicalStock, maximum);

                      return (
                        <Tooltip key={vaccine} title={
                          <Box>
                            <div>Maximum: {formatNumber(maximum)}</div>
                            <div>Actual (SOH + Received): {formatNumber(received + physicalStock)}</div>
                            <div>Percentage: {maximum > 0 ? (((received + physicalStock) / maximum) * 100).toFixed(1) : '0'}%</div>
                            <div>{getStockStatusLabel(received, physicalStock, maximum)}</div>
                          </Box>
                        } arrow>
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 700,
                              color: 'white',
                              bgcolor: bgColor,
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
                            {formatNumber(received + physicalStock)}
                          </TableCell>
                        </Tooltip>
                      );
                    })}
                  </TableRow>

                  {/* Facility Rows (Expanded) */}
                  {isEHFExpanded && ehf.facilities.map((facility, facilityIndex) => (
                    <TableRow
                      key={`${ehfKey}-facility-${facilityIndex}`}
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
                      {vaccines.map((vaccine) => {
                        const fieldName = vaccineFieldMap[vaccine];
                        const physicalStockFieldName = physicalStockFieldMap[vaccine];
                        const maximum = (facility as any)[fieldName] || 0;
                        const received = (facility as any)[`${fieldName}_received`] || 0;
                        const physicalStock = (facility as any)[physicalStockFieldName] || 0;
                        const bgColor = getStockStatus(received, physicalStock, maximum);

                        return (
                          <Tooltip key={vaccine} title={
                            <Box>
                              <div>Maximum: {formatNumber(maximum)}</div>
                              <div>Actual (SOH + Received): {formatNumber(received + physicalStock)}</div>
                              <div>Percentage: {maximum > 0 ? (((received + physicalStock) / maximum) * 100).toFixed(1) : '0'}%</div>
                              <div>{getStockStatusLabel(received, physicalStock, maximum)}</div>
                            </Box>
                          } arrow>
                            <TableCell
                              align="center"
                              sx={{
                                fontWeight: 500,
                                color: 'white',
                                bgcolor: bgColor,
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
                              {formatNumber(received + physicalStock)}
                            </TableCell>
                          </Tooltip>
                        );
                      })}
                    </TableRow>
                  ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MccoVaccineStockTable;
