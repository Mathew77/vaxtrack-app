import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
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
import { UHFType, VaccineAllocationDetail, VaccineAllocationType } from 'src/hooks/apis/ehf/ehf-type';

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

  const { data: allocationList = [] } = useFetchAllocation();
  const { data: uhfList = [] } = useFetchUHF(null); 
  const deleteAllocation = useDeleteAllocation();

  const [value, setValue] = useState<number>(0);

  const userRole = sessionStorage.getItem('userRole');

  const isEHF = userRole === 'ehf';
  const isThreePL = userRole === 'threepl'

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const transformedAllocationList: TableRow[] = useMemo(() => {
  return allocationList.map((allocation: VaccineAllocationType) => {
    if (
      !allocation.vaccines_allocation_detail ||
      !Array.isArray(allocation.vaccines_allocation_detail) ||
      allocation.vaccines_allocation_detail.length === 0
    ) {
      return {
        id: allocation.id || 0,
        request_id: 'N/A',
        uhf_id: 0,
        ehf_id: 0,
        uhf_name: 'N/A',
        state: 'N/A',
        lga: 'N/A',
        status: 0,
      };
    }

    const firstDetail = allocation.vaccines_allocation_detail[0];

    const uhf = uhfList.find((u: UHFType) => u.id === firstDetail.uhf_id);
    let uhfName = firstDetail.uhf_name || 'Unknown UHF';
      if (!firstDetail.uhf_name) {
        const uhf = uhfList.find((u: UHFType) => u.id === firstDetail.uhf_id);
        uhfName = uhf?.uhf_name || 'Unknown UHF';
      }

    return {
      id: allocation.id,
      request_id: firstDetail.request_id,
      uhf_id: firstDetail.uhf_id,
      uhf_name: uhfName,
      ehf_id: firstDetail.ehf_id,
      state: firstDetail.state,
      lga: firstDetail.lga,
      status: firstDetail.status,
    };
  });
}, [allocationList, uhfList]);

  interface DisplayStatus {
  [key: number]: string;
  }

  const displayStatus: DisplayStatus = {
    2: "Vaccine allocation request by UHF (open)",
    3: "Vaccine allocated by EHF",
    4: "Quantity received from EHF by 3PL/conveyor",
    5: "Quantity return by UHF/3PL",
    6: "Quantity return by 3PL/conveyor",
    7: "Quantity recieved by EHF after supply (closed)"
  };

  interface EditAction {
    [key: number]: string;
  }

  const editAction: EditAction = {
    2: 'Opened by UHF/3PL',
    3: 'Approved by EHF',
    4: 'Received by 3PL/Conveyor',
    5: 'Return by UHF/3PL',
    6: 'Confirm Returned by 3PL/Conveyor',
    7: 'Receieved by EHF',
  };

  const columns = useMemo(
    () => [
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
          return uhfName || 'Unknown UHF';
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
          return displayStatus[statusValue] || statusValue;
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
    navigate(`/${type}-view`, { state: { data: allocation, isView: true, isUpdate: false,},
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
    if(data.id){
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
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default VaccineAllocationList;