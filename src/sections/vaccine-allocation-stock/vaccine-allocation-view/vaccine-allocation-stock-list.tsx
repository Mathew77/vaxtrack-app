import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Chip } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useFetchStockAtHand, useFetchAllocatedVaccines, useDeleteAllocation } from 'src/hooks/apis/upload/upload-hook';
import { StockAtHandData, AllocatedVaccineData } from 'src/hooks/apis/upload/upload-type';
import { useFetchUsers } from 'src/hooks/apis/user/user-hooks';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';
import { useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { toast } from 'react-toastify';
import { keyframes } from '@mui/system';

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

// Blinking animation for pending statuses
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const VaccineAllocationStockList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role and related lists
  const userRole = useMemo(() => sessionStorage.getItem('userRole') || '', []);
  const isSLWG = userRole === 'slwg';
  const isSCS = userRole === 'scs';
  const is3PL = userRole === 'threepl';
  const isMCCO = userRole === 'mcco' || userRole === 'conveyor'; // Support both role names
  const isLCS = userRole === 'lcs';

  // Only SLWG can see Stock Upload tab
  const showStockAtHandTab = isSLWG;

  const userScsList = useMemo(() => {
    try {
      const scsListData = sessionStorage.getItem('scs_list');
      if (scsListData) {
        const parsed = JSON.parse(scsListData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing scs_list from session storage:', error);
      return [];
    }
  }, []);

  const userScsId = userScsList[0]; // Get the first SCS ID

  const userState = sessionStorage.getItem('userState') || null;

  const { data: stockData = [] } = useFetchStockAtHand(userState);
  const { data: allocatedData = [] } = useFetchAllocatedVaccines(userState);
  const { data: allUsers = [] } = useFetchUsers();
  const { data: allScs = [] } = useFetchScs();
  const { data: allLcs = [] } = useFetchLcs();

  // Get user's state for LCS filtering
  const userStateList = useMemo(() => {
    try {
      if (isLCS) {
        // Get LCS state from lcs_list
        const lcsListString = sessionStorage.getItem('lcs_list');
        if (lcsListString) {
          const lcsList = JSON.parse(lcsListString);
          if (Array.isArray(lcsList) && lcsList.length > 0) {
            const lcsId = parseInt(lcsList[0], 10);
            const lcsFacility = allLcs?.find(lcs => lcs.id === lcsId);
            // LCS only has one state (stat_id), return as array
            return lcsFacility?.stat_id ? [lcsFacility.stat_id] : [];
          }
        }
      }
      return [];
    } catch (error) {
      console.error('Error getting userStateList from session storage:', error);
      return [];
    }
  }, [isLCS, allLcs]);
  const deleteAllocationMutation = useDeleteAllocation();
  const [value, setValue] = useState<number>(0);
  const [selectedLGA, setSelectedLGA] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState<any>(null);

  // Check if we should switch to a specific tab from navigation state
  useEffect(() => {
    const state = location.state as { activeTab?: number };
    if (state?.activeTab !== undefined) {
      setValue(state.activeTab);
      // Clear the state after using it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Get SLWG users that are mapped to this SCS
  const mappedSlwgUserIds = useMemo(() => {
    if (!isSCS || !userScsId || !allUsers.length) return [];

    // Find all SLWG users who have this SCS in their scs_list
    const scsIdString = userScsId.toString();
    return allUsers
      .filter(user => {
        if (!user.scs_list || !Array.isArray(user.scs_list)) return false;
        // Check if the SCS ID exists in the user's scs_list 
        return user.scs_list.includes(scsIdString);
      })
      .map(user => user.id?.toString());
  }, [isSCS, userScsId, allUsers]);

  // Get the state managed by this SCS facility (for both SCS and SLWG users)
  const scsState = useMemo(() => {
    if ((!isSCS && !isSLWG) || !userScsId || !allScs.length) return null;

    // Find the SCS facility with this ID
    const scsFacility = allScs.find(scs => scs.id?.toString() === userScsId.toString());

    return scsFacility?.stat_id || null;
  }, [isSCS, isSLWG, userScsId, allScs]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const availableLGAs = useMemo(() => {
    let filteredStock = stockData;

    // Filter stock data based on user role before building LGA list
    if (isSCS && scsState) {
      // SCS users should only see LGAs from their state
      filteredStock = stockData.filter(item => item.state?.toUpperCase() === scsState.toUpperCase());
    } else if (isSLWG && scsState) {
      // SLWG users should only see LGAs from their state
      filteredStock = stockData.filter(item => item.state?.toUpperCase() === scsState.toUpperCase());
    } else if (isLCS && userStateList.length > 0) {
      // LCS users should only see LGAs from their assigned state
      filteredStock = stockData.filter(item =>
        userStateList.some((state: string) => state.toUpperCase() === item.state?.toUpperCase())
      );
    }

    const lgas = filteredStock.map((item) => item.lga).filter(Boolean);
    return Array.from(new Set(lgas)).sort();
  }, [stockData, isSCS, isSLWG, isLCS, scsState, userStateList]);

  // Filter stock data based on selected LGA and sort by ID ascending (oldest first)
  const filteredStockData = useMemo(() => {
    let data = selectedLGA ? stockData.filter((item) => item.lga === selectedLGA) : stockData;
    return [...data].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [stockData, selectedLGA]);


  // SCS users will only see allocations for EHFs in their state
  const enrichedAllocatedData = useMemo(() => {
    let filteredData = allocatedData;

    // If user is SCS, filter by the state managed by this SCS facility
    if (isSCS) {
      // Filter based on the SCS facility's state (case-insensitive comparison)
      if (scsState) {
        filteredData = allocatedData.filter(allocation => {
          const stockInfo = stockData.find(
            (stock) => stock.assigned_unique_id === allocation.assigned_unique_id
          );
          // Case-insensitive comparison to handle "FCT" vs "Fct"
          const isInState = stockInfo && stockInfo.state.toUpperCase() === scsState.toUpperCase();
          return isInState;
        });
      } else {
        // If no state found, show all allocations
        filteredData = allocatedData;
      }
    }

    return filteredData.map((allocation) => {
      const stockInfo = stockData.find(
        (stock) => stock.assigned_unique_id === allocation.assigned_unique_id
      );
      return {
        ...allocation,
        name_of_ehf: stockInfo?.name_of_ehf || 'N/A',
        state: stockInfo?.state || 'N/A',
        lga: stockInfo?.lga || 'N/A',
      };
    });
  }, [allocatedData, stockData, isSCS, scsState]);

  // Filter allocated data based on selected LGA and sort by ID ascending
  const filteredAllocatedData = useMemo(() => {
    let data = selectedLGA ? enrichedAllocatedData.filter((item) => item.lga === selectedLGA) : enrichedAllocatedData;
    return [...data].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [enrichedAllocatedData, selectedLGA]);


  const handleLGAChange = (event: any) => {
    setSelectedLGA(event.target.value);
  };

  const stockColumns = useMemo(
    () => [
      {
        accessorKey: 'serial_no',
        header: 'S/N',
        size: 80,
      },
      {
        accessorKey: 'assigned_unique_id',
        header: 'Unique ID',
        size: 120,
      },
      {
        accessorKey: 'name_of_ehf',
        header: 'EHF Name',
        size: 200,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
      },
      {
        accessorKey: 'lga',
        header: 'LGA',
        size: 120,
      },
      {
        accessorKey: 'ward',
        header: 'Ward',
        size: 120,
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
        size: 130,
      },
      {
        accessorKey: 'cce_count',
        header: 'CCE Count',
        size: 80,
      },
      {
        accessorKey: 'cce_functionality_status',
        header: 'CCE Status',
        size: 120,
      },
      {
        accessorKey: 'dose_bcg',
        header: 'BCG',
        size: 80,
      },
      {
        accessorKey: 'dose_hepb',
        header: 'HepB',
        size: 80,
      },
      {
        accessorKey: 'dose_bopv',
        header: 'bOPV',
        size: 80,
      },
      {
        accessorKey: 'dose_penta',
        header: 'Penta',
        size: 80,
      },
      {
        accessorKey: 'dose_pcv',
        header: 'PCV',
        size: 80,
      },
      {
        accessorKey: 'dose_ipv',
        header: 'IPV',
        size: 80,
      },
      {
        accessorKey: 'dose_mea',
        header: 'Measles',
        size: 80,
      },
      {
        accessorKey: 'dose_yf',
        header: 'YF',
        size: 80,
      },
      {
        accessorKey: 'dose_td',
        header: 'TD',
        size: 80,
      },
      {
        accessorKey: 'dose_mena',
        header: 'MenA',
        size: 80,
      },
      {
        accessorKey: 'dose_rota',
        header: 'Rota',
        size: 80,
      },
      {
        accessorKey: 'dose_hpv',
        header: 'HPV',
        size: 80,
      },
      {
        accessorKey: 'total_vaccine_storage_volume_utilized',
        header: 'Storage Used (L)',
        size: 130,
      },
      {
        accessorKey: 'remaining_cce_storage_capacity',
        header: 'Remaining Capacity (L)',
        size: 250,
      },
    ],
    []
  );

  const handleEdit = (data: StockAtHandData) => {
    navigate('/vaccine-allocation-stock-view', {
      state: {
        data: data,
        isUpdate: true,
        isView: false,
      },
    });
  };

  const handleDelete = (data: StockAtHandData) => {
    console.log('Delete stock:', data);
  };

  const handleAddNew = () => {
    navigate('/upload-view');
  };

  const stockActionItems: ActionMenuItem<StockAtHandData>[] = [
    {
      display: "Allocate Vaccine",
      handleClick: handleEdit,
      icon: <EditOutlinedIcon sx={{ color: "#1976D2" }} />,
    },
    {
      display: "Delete",
      handleClick: handleDelete,
      icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
    },
  ];

  const handleViewAllocation = (data: any) => {
    navigate('/vaccine-allocation-confirm-view', {
      state: {
        data: data,
        userRole: userRole,
        isView: true,
      },
    });
  };

  const handleConfirmDispatch = (data: any) => {
    // Navigate to confirmation page
    navigate('/vaccine-allocation-confirm-view', {
      state: {
        data: data,
        userRole: userRole,
        isView: false,
      },
    });
  };

  const handleConfirmPickup = (data: any) => {
    // Navigate to confirmation page for 3PL
    navigate('/vaccine-allocation-confirm-view', {
      state: {
        data: data,
        userRole: userRole,
        isView: false,
      },
    });
  };

  const handleMccoConfirm = (data: any) => {
    // Navigate to MCCO confirmation page with VVM, batch, expiry inputs
    navigate('/vaccine-allocation-mcco-confirm', {
      state: {
        data: data,
        userRole: userRole,
      },
    });
  };

  const handleLcsReview = (data: any) => {
    // Navigate to LCS return processing page
    navigate('/vaccine-allocation-lcs-return', {
      state: {
        data: data,
        userRole: userRole,
      },
    });
  };

  const handleDeleteAllocation = (data: any) => {
    setAllocationToDelete(data);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!allocationToDelete) return;

    deleteAllocationMutation.mutate(allocationToDelete.id, {
      onSuccess: () => {
        toast.success('Allocation deleted successfully!');
        setDeleteDialogOpen(false);
        setAllocationToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete allocation');
        setDeleteDialogOpen(false);
      },
    });
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setAllocationToDelete(null);
  };

  // Action items for SCS users - only show confirm if status = 0
  const getScsActionItems = (row: any): ActionMenuItem<any>[] => {
    const baseActions: ActionMenuItem<any>[] = [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];

    // Only show confirm if status = 0 (pending SCS confirmation)
    if (row.status === 0) {
      baseActions.push({
        display: "Confirm Dispatch to 3PL",
        handleClick: handleConfirmDispatch,
        icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
      });
    }

    return baseActions;
  };

  // Action items for 3PL users - only show confirm if status = 1
  const get3PlActionItems = (row: any): ActionMenuItem<any>[] => {
    const baseActions: ActionMenuItem<any>[] = [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];

    // Only show confirm if status = 1 (pending 3PL pickup)
    if (row.status === 1) {
      baseActions.push({
        display: "Confirm Pickup & Delivery",
        handleClick: handleConfirmPickup,
        icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
      });
    }

    return baseActions;
  };

  // Action items for MCCO users - only show confirm if status = 2
  const getMccoActionItems = (row: any): ActionMenuItem<any>[] => {
    const baseActions: ActionMenuItem<any>[] = [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];

    // Only show confirm if status = 2 (pending MCCO confirmation)
    if (row.status === 2) {
      baseActions.push({
        display: "Confirm Receipt",
        handleClick: handleMccoConfirm,
        icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
      });
    }

    return baseActions;
  };

  // Action items for LCS users - only show process returns if status = 3
  const getLcsActionItems = (row: any): ActionMenuItem<any>[] => {
    const baseActions: ActionMenuItem<any>[] = [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];

    // Only show process returns if status = 3 (pending LCS review)
    if (row.status === 3) {
      baseActions.push({
        display: "Process Returns",
        handleClick: handleLcsReview,
        icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
      });
    }

    return baseActions;
  };

//   const handleConfirmAllocationToEHF = (data: any) => {
//     // Navigate to confirmation page for SLWG to confirm allocation to EHF
//     navigate('/vaccine-allocation-confirm-view', {
//       state: {
//         data: data,
//         userRole: userRole,
//         isView: false,
//         confirmToEHF: true,
//       },
//     });
//   };

  // Action items for SLWG - can only delete if status = 0 (not yet confirmed by SCS)
  const getSlwgActionItems = (row: any): ActionMenuItem<any>[] => {
    const baseActions: ActionMenuItem<any>[] = [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];

    // Only show confirm allocation and delete if status = 0 (before SCS confirmation)
    if (row.status === 0) {
      baseActions.push({
        display: "Delete",
        handleClick: handleDeleteAllocation,
        icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
      });
    }

    return baseActions;
  };

  // Choose action items based on user role
  // All roles now use dynamic functions that check status
  const getActionItems = isSCS
    ? getScsActionItems
    : is3PL
    ? get3PlActionItems
    : isMCCO
    ? getMccoActionItems
    : isLCS
    ? getLcsActionItems
    : isSLWG
    ? getSlwgActionItems
    : undefined;

  const allocatedColumns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'S/N',
        size: 80,
        Cell: ({ row }: any) => row.index + 1,
      },
      {
        accessorKey: 'name_of_ehf',
        header: 'EHF Name',
        size: 200,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
      },
      {
        accessorKey: 'lga',
        header: 'LGA',
        size: 120,
      },
      {
        accessorKey: 'dose_bcg_allocated',
        header: 'BCG',
        size: 80,
      },
      {
        accessorKey: 'dose_hepb_allocated',
        header: 'HepB',
        size: 80,
      },
      {
        accessorKey: 'dose_bopv_allocated',
        header: 'bOPV',
        size: 80,
      },
      {
        accessorKey: 'dose_penta_allocated',
        header: 'Penta',
        size: 80,
      },
      {
        accessorKey: 'dose_pcv_allocated',
        header: 'PCV',
        size: 80,
      },
      {
        accessorKey: 'dose_ipv_allocated',
        header: 'IPV',
        size: 80,
      },
      {
        accessorKey: 'dose_mea_allocated',
        header: 'Measles',
        size: 80,
      },
      {
        accessorKey: 'dose_yf_allocated',
        header: 'YF',
        size: 80,
      },
      {
        accessorKey: 'dose_td_allocated',
        header: 'TD',
        size: 80,
      },
      {
        accessorKey: 'dose_mena_allocated',
        header: 'MenA',
        size: 80,
      },
      {
        accessorKey: 'dose_rota_allocated',
        header: 'Rota',
        size: 80,
      },
      {
        accessorKey: 'dose_hpv_allocated',
        header: 'HPV',
        size: 80,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 200,
        Cell: ({ cell }: any) => {
          const status = cell.getValue();
          // Status workflow: 0 = Allocated by SLWG, 1 = Confirmed by SCS, 2 = Picked up by 3PL, 3 = Pending LCS Review, 4 = Completed
          let label = 'Unknown';
          let color: 'warning' | 'success' | 'info' | 'default' = 'default';
          let shouldBlink = false;

          if (status === 0) {
            label = 'Pending SCS Confirmation';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 1) {
            label = 'Pending 3PL Pickup';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 2) {
            label = 'Pending MCCO Confirmation';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 3) {
            label = 'Pending LCS Review';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 4) {
            label = 'Completed';
            color = 'success';
            shouldBlink = false;
          }

          return (
            <Chip
              label={label}
              color={color}
              size="small"
              sx={shouldBlink ? {
                animation: `${blink} 2s ease-in-out infinite`,
              } : {}}
            />
          );
        },
      }
    ],
    []
  );

  return (
    <>
      {/* Only show tabs if SLWG, otherwise show allocated data directly */}
      {showStockAtHandTab && (
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          aria-label="scrollable force tabs"
        >
          <Tab style={{ textTransform: 'none' }} label="Stock Upload" {...a11yProps(0)} />
          <Tab style={{ textTransform: 'none' }} label="Vaccine Allocated" {...a11yProps(1)} />
        </Tabs>
      )}

      {/* Filter Section - Below Tabs (Hidden for 3PL and MCCO) */}
      {!is3PL && !isMCCO && (
        <Box sx={{ mt: 3, mb: 2, px: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by LGA</InputLabel>
                <Select
                  value={selectedLGA}
                  onChange={handleLGAChange}
                  label="Filter by LGA"
                >
                  <MenuItem value="">
                    <em>All LGAs</em>
                  </MenuItem>
                  {availableLGAs.map((lga) => (
                    <MenuItem key={lga} value={lga}>
                      {lga}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Show Stock Upload tab only for SLWG */}
      {showStockAtHandTab && (
        <TabPanel value={value} index={0}>
          <Box>
            <VaxTable
              columns={stockColumns}
              data={filteredStockData}
              tableHeader="Stock Upload"
              customRightButtonText=""
              customRightButtonCallBackFunction={handleAddNew}
              actionMenuItems={stockActionItems}
              showDownloadButton={false}
            />
          </Box>
        </TabPanel>
      )}

      {/* Show Vaccine Allocated - for SLWG it's tab index 1, for others it's always visible */}
      {showStockAtHandTab ? (
        <TabPanel value={value} index={1}>
          <Box>
            <VaxTable
              columns={allocatedColumns}
              data={filteredAllocatedData}
              tableHeader="Vaccine Allocated"
              customRightButtonText=""
              customRightButtonCallBackFunction={handleAddNew}
              getActionMenuItems={getActionItems}
              showDownloadButton={true}
            />
          </Box>
        </TabPanel>
      ) : (
        <Box>
          <VaxTable
            columns={allocatedColumns}
            data={filteredAllocatedData}
            tableHeader="Vaccine Allocated"
            getActionMenuItems={getActionItems}
            showDownloadButton={true}
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this vaccine allocation for{' '}
            <strong>{allocationToDelete?.name_of_ehf}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteAllocationMutation.isPending}
          >
            {deleteAllocationMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VaccineAllocationStockList;