import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import type { MRT_Cell } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { useFetchThreePl, useDeleteThreepl } from 'src/hooks/apis/threepl/threepl-hooks';
import { FaEye } from 'react-icons/fa';
import { useFetchAllocation, useFetchUHF, useDeleteAllocation } from 'src/hooks/apis/ehf/ehf-hooks';
import { VaccineAllocationDetail, VaccineAllocationType } from 'src/hooks/apis/ehf/ehf-type';
import { useFetchEHFsByIds } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { keyframes } from '@mui/system';

// Blinking animation for pending statuses
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

interface TableRow {
  id?: number;
  request_id: string;
  uhf_id: number;
  uhf_name: string;
  ehf_id: number;
  status: number;
  state: string;
  lga: string;
}

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

const VaccineAllocationList: React.FC = () => {
  const navigate = useNavigate();

  const { data: allocationList = [], isLoading, isFetching } = useFetchAllocation();
  const { data: uhfList = [] } = useFetchUHF(null);
  const deleteAllocation = useDeleteAllocation();

  const [value, setValue] = useState<number>(0);

  const userRole = sessionStorage.getItem('userRole');

  const isEHF = userRole === 'ehf';
  const isThreePL = userRole === 'threepl';
  const isConveyor = userRole === 'conveyor';

  // Get Conveyor's assigned EHF IDs from sessionStorage
  const conveyorAssignedEhfs = useMemo(() => {
    if (!isConveyor) return [];
    try {
      const ehfListData = sessionStorage.getItem('ehf_list');
      if (ehfListData) {
        const parsed = JSON.parse(ehfListData);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error parsing ehf_list:', error);
    }
    return [];
  }, [isConveyor]);

  // Fetch real EHF data to get the actual state name
  const { data: conveyorEhfs = [], isLoading: isConveyorLoading } = useFetchEHFsByIds(isConveyor ? conveyorAssignedEhfs : []);

  const conveyorState = useMemo(() => {
    if (!isConveyor || conveyorEhfs.length === 0) return null;
    return conveyorEhfs[0]?.state || null;
  }, [isConveyor, conveyorEhfs]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const transformedAllocationList: TableRow[] = useMemo(() => {

    if (!allocationList || allocationList.length === 0) {
        return [];
    }

    // Wait for conveyor's state to load before filtering
    if (isConveyor && isConveyorLoading) {
      return [];
    }

    const processed = allocationList
      .filter((allocation: VaccineAllocationType) => {
        // --- DEBUG: Temporarily bypass filter to see if data appears ---
        if (isConveyor && conveyorState) {
          const details = allocation.vaccines_allocation_detail || [];
          const matches = details.some(
            (d) => d?.state?.toUpperCase() === conveyorState.toUpperCase()
          );
          return matches; 
        }
        return true; 
      })
      .map((allocation: VaccineAllocationType) => {
        const details = allocation.vaccines_allocation_detail || [];
        
        // If details is empty, we still want to see the row ID in the table
        if (details.length === 0) {
          return {
            id: allocation.id,
            request_id: 'EMPTY-DETAIL',
            uhf_id: 0,
            ehf_id: 0,
            uhf_name: 'No Details',
            state: 'N/A',
            lga: 'N/A',
            status: 0,
          };
        }

        const firstDetail = details[0];
        
        return {
          id: allocation.id,
          request_id: firstDetail.request_id || 'N/A',
          uhf_id: firstDetail.uhf_id,
          uhf_name: firstDetail.uhf_name || 'Unnamed UHF',
          ehf_id: firstDetail.ehf_id,
          state: firstDetail.state || 'N/A',
          lga: firstDetail.lga || 'N/A',
          status: firstDetail.status,
        };
      })
      .sort((a, b) => (b.id || 0) - (a.id || 0));

    return processed;
  }, [allocationList, uhfList, isConveyor, conveyorState, isConveyorLoading]);

  interface DisplayStatus {
    [key: number]: string;
  }

  const displayStatus: DisplayStatus = {
    2: "Vaccine allocation request by UHF (open)",
    3: "Vaccine allocated by EHF",
    4: "Quantity received from EHF by 3PL/conveyor",
    5: "Quantity return by UHF/3PL",
    6: "Quantity Allocated by EHF",
    7: "Quantity Received by EHF"
  };

  interface EditAction {
    [key: number]: string;
  }

  const editAction: EditAction = {
    2: 'Opened by UHF/3PL',
    3: 'Approved by EHF',
    4: 'Received by 3PL/Conveyor',
    5: 'Return by UHF/3PL',
    6: 'Allocated by EHF',
    7: 'Received by EHF',
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serial_no",
        header: "S/N",
        size: 80,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => row.index + 1,
      },
      {
        accessorKey: "request_id",
        header: "Request ID",
        size: 250,
      },
      {
        accessorKey: "uhf_name",
        header: "UHF Name",
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<TableRow, unknown> }) => {
          const uhfName = cell.getValue() as string;
          return uhfName || 'No UHF Available';
        },
      },
      // {
      //   accessorKey: "uhf_id",
      //   header: "UHF ID",
      //   size: 150,
      // },
      {
        accessorKey: "state",
        header: "State",
        size: 150,
      },
      {
        accessorKey: "lga",
        header: "LGA",
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<TableRow, unknown> }) => {
          const statusValue = cell.getValue() as number;
          const statusText = displayStatus[statusValue] || statusValue;

          let color: 'warning' | 'success' | 'info' = 'info';
          let shouldBlink = false;

          if (statusValue === 6) {
            // Quantity Allocated by EHF - orange with blinking
            color = 'warning';
            shouldBlink = true;
          } else if (statusValue === 7) {
            // Quantity Received by EHF - green
            color = 'success';
            shouldBlink = false;
          } else {
            // Other statuses - blue/info
            color = 'info';
            shouldBlink = false;
          }

          return (
            <Chip
              label={statusText}
              color={color}
              size="small"
              sx={shouldBlink ? {
                animation: `${blink} 2s ease-in-out infinite`,
              } : {}}
            />
          );
        },
      },
    ],
    []
  );

  const getTabType = () => 'vaccine';

  const handleView = (data: TableRow) => {
    const type = getTabType();
    const allocation = allocationList.find((alloc: VaccineAllocationType) => alloc.id === data.id);
    if (allocation) {
      navigate(`/${type}-view`, {
        state: { data: allocation, isView: true, isUpdate: false, },
      });
    }
  };

  const handleEdit = (data: TableRow) => {
    const type = getTabType();
    const allocation = allocationList.find((alloc: VaccineAllocationType) => alloc.id === data.id);
    if (allocation) {
      // console.log('Navigating with allocation:', JSON.stringify(allocation, null, 2));
      navigate(`/${type}-view`, {
        state: {
          data: allocation,
          isView: false,
          isUpdate: true,
        },
      });
    }
  };

  const handleDelete = (data: TableRow) => {
    if (data.id) {
      deleteAllocation.mutate(data.id)
    }
  };

  const handleAddNew = () => {
    const type = getTabType();
    navigate(`/${type}-view`);
  };

  const allocationItem: ActionMenuItem<TableRow>[] = [
    {
      display: "View",
      handleClick: handleView,
      icon: <FaEye style={{ color: "#1976D2" }} />,
    },
    {
      display: (row: TableRow) => editAction[row.status] || 'Edit',
      handleClick: handleEdit,
      icon: <EditOutlinedIcon sx={{ color: '#1976D2' }} />,
    },
    ...(userRole !== "ehf"
      ? [
        {
          display: "Delete",
          handleClick: handleDelete,
          icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
        },
      ]
      : []),
  ];

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        aria-label="scrollable force tabs"
      >
        <Tab style={{ textTransform: 'none' }} label="Vaccine Allocation - Summary Page" {...a11yProps(0)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={transformedAllocationList}
            tableHeader="Vaccine Allocation - Summary Page"
            customRightButton={!isEHF}
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonText={"REQUEST VACCINE ALLOCATION"}
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={allocationItem}
            showDownloadButton={false}
            loading={isLoading || isFetching || (isConveyor && isConveyorLoading)}
            getRowStyles={(row: any) => {
              // Highlight rows with status 6 (Quantity Allocated by EHF)
              if (row.status === 6) {
                return {
                  bgcolor: '#fff3e0', // Light orange/brown background
                  '&:hover': {
                    bgcolor: '#ffe0b2 !important', // Slightly darker on hover
                  },
                };
              }
              return {};
            }}
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default VaccineAllocationList;