import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useNavigate } from 'react-router-dom';
import { useFetchUHF, useDeleteUHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { FaEye } from 'react-icons/fa';
import { useDeleteEHF, useFetchEHF } from 'src/hooks/apis/ehf-uhf/ehf-hooks';

interface TableRow {
  id?: number;
  state?: string;
  lga?: string;
  ward?: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  contact_person_email?: string;
  org_unit?: string;
  uhf_name?: string;
  ehf_name?: string;
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

  const [value, setValue] = useState<number>(0);

  const { data: ehfList = [] } = useFetchEHF();
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
        accessorKey: 'ehf_name',
        header: 'EHF Name',
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
      {
        accessorKey: 'ward',
        header: 'Ward',
        size: 120,
      },
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
    navigate(`/${type}-setup`, { state: { data, isView: true } });
  };

  const handleEdit = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isUpdate: true } });
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
    navigate(`/${getTabType()}-setup`);
  };

  const ehfItem: ActionMenuItem<TableRow>[] = [
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

  const uhfItem: ActionMenuItem<TableRow>[] = [
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
        <Tab style={{ textTransform: 'none' }} label="EHF " {...a11yProps(0)} />
        <Tab style={{ textTransform: 'none' }} label="UHF " {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={ehfColumns}
            data={ehfList}
            tableHeader="EHF List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="Add EHF"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={ehfItem}
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
            columns={uhfColumns}
            data={uhfList}
            tableHeader="UHF List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="Add UHF"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={uhfItem}
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

export default EhfUHFList;