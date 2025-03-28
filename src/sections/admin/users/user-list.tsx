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
import { useFetchUsers, useDeleteUser } from 'src/hooks/apis/user/user-hooks';
import { FaEye } from 'react-icons/fa';

interface TableRow {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  groups: number[];
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

    const { data: userList = [] } = useFetchUsers();
    const deleteUser = useDeleteUser();

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
        accessorKey: 'first_name',
        header: 'Full Name',
        size: 200,
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        size: 200,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
        size: 200,
      },
      {
        accessorKey: 'org_unit',
        header: 'Org. Unit',
        size: 200,
      },
      {
        accessorKey: 'groups',
        header: 'Role',
        size: 200,
        Cell: ({ cell }: { cell : {getValue: () => unknown }}) => {
          const group = cell.getValue() as [];
          return group.join(',  ')
        }
      },
      // {
      //   accessorKey: 'user_permissions',
      //   header: 'User Permission',
      //   size: 200,
      //   Cell: ({ cell }: { cell : {getValue: () => unknown }}) => {
      //     const user_permissions = cell.getValue() as [];
      //     return user_permissions.join(',  ')
      //   }
      // },
    ],
    []
  );


  const getTabType = () => 'user';

  const handleView = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isView: true } });
  };

  const handleEdit = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isUpdate: true } });
  };

  const handleDelete = (data: TableRow) => {
    if (data.id) {
      deleteUser.mutate(data.id);
    }
  };

  const handleAddNew = () => {
    const type = getTabType();
    navigate(`/${type}-setup`);
  };


  const userItem: ActionMenuItem<TableRow>[] = [
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
        <Tab style={{ textTransform: 'none' }} label="User Management" {...a11yProps(0)} />
        
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={userList}
            tableHeader="User Management List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="Add User"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={userItem}
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