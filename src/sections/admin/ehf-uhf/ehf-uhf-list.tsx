import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchUHF, useDeleteUHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { FaEye } from 'react-icons/fa';
import { useDeleteEHF, useFetchEHFList } from 'src/hooks/apis/ehf-uhf/ehf-hooks';

interface TableRow {
  id?: number;
  state?: string;
  lga?: string;
  // ward?: string;
  contact_person_name?: string | null;
  contact_person_phone?: string | null;
  contact_person_email?: string | null;
  assigned_ehf_unique_id?: string;
  uhf_name?: string;
  ehf_name?: string;
  longtitude?: string | null;
  lagtitude?: string | null;
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

const EhfUHFList: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const initialTab = state?.activeTab || 0;

  useEffect(() => {
    setValue(initialTab);
  }, [initialTab]);

  const [value, setValue] = useState<number>(initialTab);

  const { data: ehfList = [] } = useFetchEHFList();
  const deleteEHF = useDeleteEHF();

  const { data: uhfList = [] } = useFetchUHF();
  const deleteUHF = useDeleteUHF();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const ehfColumns = useMemo(
    () => [
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
        accessorKey: 'name_of_ehf',
        header: 'EHF Name',
        size: 200,
      },
      {
        accessorKey: 'assigned_unique_id',
        header: 'Unique ID',
        size: 100,
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone',
        size: 120,
      },
      {
        accessorKey: 'cce_model',
        header: 'CCE Model',
        size: 120,
      },
      {
        accessorKey: 'cce_functionality_status',
        header: 'CCE Status',
        size: 120,
      },
      {
        accessorKey: 'hard_to_reach',
        header: 'Hard to Reach',
        size: 100,
      },
    ],
    []
  );

  const uhfColumns = useMemo(
    () => [
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
      // {
      //   accessorKey: 'ward',
      //   header: 'Ward',
      //   size: 120,
      // },
      {
        accessorKey: 'uhf_name',
        header: 'UHF Name',
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


  const getTabType = () => (value === 0 ? 'ehf' : 'uhf');

  const handleView = (data: TableRow) => {
    const type = getTabType();
    if (type === 'ehf') {
      navigate('/ehf-view', { state: { data, activeTab: value } });
    } else {
      navigate(`/${type}-setup`, { state: { data, isView: true, activeTab: value } });
    }
  };

  const handleEdit = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isUpdate: true, activeTab: value } });
  };

  const handleDelete = (data: TableRow) => {
    const type = getTabType();
    if (data.id) {
      if(type === 'ehf'){
        deleteEHF.mutate(data.id)
      }else {
        deleteUHF.mutate(data.id);
      }
    }
  };

  const handleAddNew = () => {
    navigate(`/${getTabType()}-setup`, { state: { activeTab: value } });
  };

  const ehfItem: ActionMenuItem<TableRow>[] = [
    {
      display: "View Details",
      handleClick: handleView,
      icon: <FaEye style={{ color: "#1976D2" }} />,
    },
    // {
    //   display: "Edit",
    //   handleClick: handleEdit,
    //   icon: <EditOutlinedIcon sx={{ color: "#1976D2" }} />,
    // },
    // {
    //   display: "Delete",
    //   handleClick: handleDelete,
    //   icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
    // },
  ];

  const uhfItem: ActionMenuItem<TableRow>[] = [
    {
      display: "View",
      handleClick: handleView,
      icon: <FaEye style={{ color: "#1976D2" }} />,
    },
    // {
    //   display: "Edit",
    //   handleClick: handleEdit,
    //   icon: <EditOutlinedIcon sx={{ color: "#1976D2" }} />,
    // },
    // {
    //   display: "Delete",
    //   handleClick: handleDelete,
    //   icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
    // },
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
        <Tab style={{ textTransform: 'none' }} label="Equipped Health Facility" {...a11yProps(0)} />
        {/* <Tab style={{ textTransform: 'none' }} label="Unequipped Health Facility" {...a11yProps(1)} /> */}
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={ehfColumns}
            data={ehfList}
            tableHeader="Equipped Health Facility List"
            // customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            // customRightButtonText=""
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={ehfItem}
            showDownloadButton={false}
          />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box>
          <VaxTable
            columns={uhfColumns}
            data={uhfList}
            tableHeader="Unequipped Health Facility List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonText="ADD UNEQUIPPED HEALTH FACILITY"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={uhfItem}
           showDownloadButton={false}
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default EhfUHFList;