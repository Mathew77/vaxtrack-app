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
import { useFetchLcsDashboard } from 'src/hooks/apis/dashboards/lcs/lcs-dashboard-hook';
import type { LcsDashboardWardType } from 'src/hooks/apis/dashboards/lcs/lcs-dashboard-type';

interface VaccineDetailData {
  vaccine: string;
  location: string;
  locationType: 'Ward' | 'Facility';
  actualStock: number;
  allocatedStock: number;
  percentage: string;
  status: string;
  facilityName?: string;
}

const VaccineStockTable = () => {
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});
  const { data, isLoading, error } = useFetchLcsDashboard();

  // Stock status colors
  const stockColors = {
    understocked: '#E8753A',
    reorder: '#F4C542',
    adequate: '#43A047',
    overstocked: '#90CAF9',
    notAvailable: '#616161'
  };

  // Function to determine cell color based on stock level percentage
  const getStockStatus = (actualStock: number, allocatedStock: number) => {
    if (actualStock <= 0) return stockColors.notAvailable;
    if (allocatedStock <= 0) return stockColors.notAvailable;

    const percentage = (allocatedStock / actualStock) * 100;

    if (percentage <= 25) return stockColors.understocked;
    if (percentage <= 50) return stockColors.reorder;
    if (percentage <= 100) return stockColors.adequate;
    return stockColors.overstocked;
  };

  const getStockStatusLabel = (actualStock: number, allocatedStock: number) => {
    if (actualStock <= 0 || allocatedStock <= 0) return 'Not Available';

    const percentage = (allocatedStock / actualStock) * 100;

    if (percentage <= 25) return 'Understocked - Below Buffer';
    if (percentage <= 50) return 'Re-order - Below Sufficient';
    if (percentage <= 100) return 'Adequate - Above Re-order Point';
    return 'Over-stocked - Above Max. Need';
  };

  const vaccines = ['BCG', 'BOPV', 'HPV', 'HEPB', 'IPV', 'MEASLES', 'MENA', 'PCV', 'PENTA', 'ROTA', 'TD', 'YF'];

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  };

  const toggleWard = (ward: string) => {
    setExpandedWards(prev => ({
      ...prev,
      [ward]: !prev[ward]
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
    'YF': 'dose_yf'
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
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.understocked, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Understocked</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>Below Buffer</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.reorder, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Re-order</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>Below Sufficient</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.adequate, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Adequate</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>Above Re-order Point</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.overstocked, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Over-stocked</Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 0.25 }}>Above Max. Need</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stockColors.notAvailable, flexShrink: 0, boxShadow: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>Not Available</Typography>
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
            {/* Ward Rows */}
            {data.map((wardData) => (
              <>
                {/* Ward Row */}
                <TableRow
                  key={wardData.ward}
                  sx={{
                    '&:hover td:first-of-type': { bgcolor: 'grey.50' }
                  }}
                >
                  <TableCell
                    onClick={() => toggleWard(wardData.ward)}
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
                        {expandedWards[wardData.ward] ? <Remove sx={{ fontSize: 14 }} /> : <Add sx={{ fontSize: 14 }} />}
                      </IconButton>
                      <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.8rem' }}>
                        {wardData.ward} Ward
                      </Typography>
                    </Box>
                  </TableCell>
                  {vaccines.map(vaccine => {
                    const fieldName = vaccineFieldMap[vaccine];
                    const allocatedFieldName = `${fieldName}_allocated`;
                    const actualValue = wardData.sum_of_vaccine_at_ward_level[fieldName as keyof typeof wardData.sum_of_vaccine_at_ward_level] as number | null;
                    const allocatedValue = wardData.sum_of_vaccine_at_ward_level[allocatedFieldName as keyof typeof wardData.sum_of_vaccine_at_ward_level] as number | null;
                    const percentage = (allocatedValue || 0) > 0 && (actualValue || 0) > 0 ? (((allocatedValue || 0) / (actualValue || 0)) * 100).toFixed(1) : 'N/A';
                    return (
                      <Tooltip
                        key={vaccine}
                        title={
                          <Box sx={{ p: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>{vaccine}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>Actual: {formatNumber(actualValue)}</Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>Allocated: {formatNumber(allocatedValue)}</Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>Percentage: {percentage}%</Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                              {getStockStatusLabel(actualValue || 0, allocatedValue || 0)}
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 700,
                            color: 'white',
                            bgcolor: getStockStatus(actualValue || 0, allocatedValue || 0),
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
                          {formatNumber(actualValue)}
                        </TableCell>
                      </Tooltip>
                    );
                  })}
                </TableRow>

                {/* Facility Rows */}
                {expandedWards[wardData.ward] && wardData.facilities.map((facility) => (
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
                      <Box sx={{ pl: 4 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {facility.name_of_ehf}
                        </Typography>
                      </Box>
                    </TableCell>
                    {vaccines.map(vaccine => {
                      const fieldName = vaccineFieldMap[vaccine];
                      const allocatedFieldName = `${fieldName}_allocated`;
                      const actualValue = facility[fieldName as keyof typeof facility] as number | null;
                      const allocatedValue = facility[allocatedFieldName as keyof typeof facility] as number | null;
                      const percentage = (allocatedValue || 0) > 0 && (actualValue || 0) > 0 ? (((allocatedValue || 0) / (actualValue || 0)) * 100).toFixed(1) : 'N/A';
                      return (
                        <Tooltip
                          key={vaccine}
                          title={
                            <Box sx={{ p: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>{vaccine} - {facility.name_of_ehf}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>Actual: {formatNumber(actualValue)}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>Allocated: {formatNumber(allocatedValue)}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>Percentage: {percentage}%</Typography>
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                                {getStockStatusLabel(actualValue || 0, allocatedValue || 0)}
                              </Typography>
                            </Box>
                          }
                          arrow
                          placement="top"
                        >
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 500,
                              color: 'white',
                              bgcolor: getStockStatus(actualValue || 0, allocatedValue || 0),
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
                            {formatNumber(actualValue)}
                          </TableCell>
                        </Tooltip>
                      );
                    })}
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
  );
};

export default VaccineStockTable;
