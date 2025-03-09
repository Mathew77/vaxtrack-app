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

interface TableRow {
  username: string;
  full_name: string;
  email: string;
  address: string;
  phone_number: string;
  role: string;
  org_unit: string;
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

const UserList: React.FC = () => {
    const navigate = useNavigate();

  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const rolesList: TableRow[] = [];
  const permissionsList: TableRow[] = [];

  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: 'User Name',
        size: 100,
      },
      {
        accessorKey: 'full_name',
        header: 'Full Name',
        size: 200,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 200,
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
        size: 200,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 200,
      },
      {
        accessorKey: 'org_unit',
        header: 'Org. Unit',
        size: 200,
      },
    ],
    []
  );


  const actionMenuItems: ActionMenuItem<TableRow>[] = [
    {
      display: 'View',

    },
    {
      display: 'Edit',
      icon: <EditOutlinedIcon />,
    },
    {
      display: 'Delete',
      icon: <DeleteForeverOutlinedIcon />,
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
        <Tab style={{ textTransform: 'none' }} label="User Management" {...a11yProps(0)} />
        
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={rolesList}
            tableHeader="User List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="Add User"
            customRightButtonCallBackFunction={() => navigate('/user-setup')}
            actionMenuItems={actionMenuItems}
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

export default UserList;