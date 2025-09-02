import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useDeleteLcs, useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { useDeleteScs, useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';

interface TableRow {
    id?: number;
    stat_id?: string;
    lga_id?: string;
    lcs_name?: string;
    scs_name?: string;
    contact_person_name?: string;
    contact_person_phone?: string;
    contact_person_email?: string;
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

const LcsScsList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const initialTab = state?.activeTab || 0;

  const [value, setValue] = useState<number>(initialTab);

  const { data: lcsList = [] } = useFetchLcs();
  const deleteLcs = useDeleteLcs();

  const { data: scsList = [] } = useFetchScs();
  const deleteScs = useDeleteScs()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // const lccoList: TableRow[] = [];
  // const scsList: TableRow[] = [];

  const lscColumns = useMemo(
    () => [
      {
        accessorKey: 'stat_id',
        header: 'State',
        size: 100,
      },
      {
        accessorKey: 'lga_id',
        header: 'LGA',
        size: 150,
      },
      {
        accessorKey: 'lcs_name',
        header: 'LCS Name',
        size: 150,
      },
      {
        accessorKey: 'contact_person_name',
        header: 'Contact Person',
        size: 150,
      },
      {
        accessorKey: 'contact_person_phone',
        header: 'Phone',
        size: 120,
      },
      {
        accessorKey: 'contact_person_email',
        header: 'Email',
        size: 200,
      },
    ],
    []
  );


  const scsColumns = useMemo(
    () => [
      {
        accessorKey: 'stat_id',
        header: 'State',
        size: 100,
      },
      {
        accessorKey: 'scs_name',
        header: 'SCS Name',
        size: 200,
      },
      {
        accessorKey: 'contact_person_name',
        header: 'Contact Person',
        size: 200,
      },
      {
        accessorKey: 'contact_person_phone',
        header: 'Phone',
        size: 120,
      },
      {
        accessorKey: 'contact_person_email',
        header: 'Email',
        size: 200,
      },
    ],
    []
  );


  const getTabType = () => (value === 0 ? 'lcs' : 'scs');

  const handleView = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isView: true, activeTab: value } });
  };

  const handleEdit = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isUpdate: true, activeTab: value } });
  };

  const handleDelete = (data: TableRow) => {
    const type = getTabType();
    if (data.id) {
      if(type === "lcs"){
        deleteLcs.mutate(data.id);
      }else {
        deleteScs.mutate(data.id);
      }   
    }
  };

  const handleAddNew = () => {
    navigate(`/${getTabType()}-setup`, {state: { activeTab: value }});
  };

  const scsItem: ActionMenuItem<TableRow>[] = [
    {
      display: "View",
      handleClick: handleView,
      icon: <FaEye style={{ color: "#1976D2" }} />, 
    },
    {
      display: "Edit",
      handleClick: handleEdit,
      icon: <EditOutlinedIcon sx={{ color: "#1976D2" }} />, 
    },
    {
      display: "Delete",
      handleClick: handleDelete,
      icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />, 
    },
  ];

  const lcsItem: ActionMenuItem<TableRow>[] = [
    {
      display: "View",
      handleClick: handleView,
      icon: <FaEye style={{ color: "#1976D2" }} />, 
    },
    {
      display: "Edit",
      handleClick: handleEdit,
      icon: <EditOutlinedIcon sx={{ color: "#1976D2" }} />, 
    },
    {
      display: "Delete",
      handleClick: handleDelete,
      icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />, 
    },
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
        <Tab style={{ textTransform: 'none' }} label="Local Cold Chain Store" {...a11yProps(0)} />
        <Tab style={{ textTransform: 'none' }} label="State Cold Chain Store" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={lscColumns}
            data={lcsList}
            tableHeader="Local Cold Chain Store List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="ADD LOCAL COLD CHAIN STORE"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={lcsItem}
            headerStyles={{
              backgroundColor: '#1976D2',
              color: 'white',
              fontSize: '16px',
            }}
          />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box>
          <VaxTable
            columns={scsColumns}
            data={scsList}
            tableHeader="State Cold Chain Store List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="ADD STATE COLD CHAIN STORE"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={scsItem}
            headerStyles={{
              backgroundColor: '#1976D2',
              color: 'white',
              fontSize: '16px',
            }}
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default LcsScsList;