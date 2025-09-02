import React, { act, useMemo, useState } from 'react';
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
import { useDeleteRole, useFetchPermissions, useFetchRoles } from 'src/hooks/apis/roles-permissions/roles-hook';

interface TableRow {
  id?: string | number;
  name: string;
  // fk_org_unit_level_id: string
  // org_unit_level_name: string;
  // permissions: string[]
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

const RolesPermissionsList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const initialTab = state?.activeTab || 0

  const [value, setValue] = useState<number>(initialTab);

  const { data: rolesList = [] } = useFetchRoles();
  const deleteRole = useDeleteRole();
  const { data: permissionsList = [] } = useFetchPermissions();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // const rolesList: TableRow[] = [];
  // const permissionsList: TableRow[] = [];

  const rolesColumn = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 100,
      },
      // {
      //   accessorKey: 'fk_org_unit_level_id',
      //   header: 'Organisation Level ID',
      //   size: 200,
      // },
      // {
      //   accessorKey: 'org_unit_level_name',
      //   header: 'Organisation Level Name',
      //   size: 200,
      // },
    ],
    []
  );

  const permissionColumns = useMemo(
      () => [
        {
          accessorKey: 'name',
          header: 'Name',
          size: 100,
        },
      ],
      []
    );


  const getTabType = () => (value === 0 ? 'role' : 'permission');

  const handleView = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isView: true, activeTab: value }});
  };

  const handleEdit = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isUpdate: true, activeTab: value } });
  };

  const handleDelete = (data: TableRow) => {
    if (data.id) {
      deleteRole.mutate(data.id);
    }
  };
  

  const handleAddNew = () => {
    navigate(`/${getTabType()}-setup`, {state: { activeTab: value }});
  };
  

  const rolesItem: ActionMenuItem<TableRow>[] = [
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

  const permissionItem: ActionMenuItem<TableRow>[] = [
    {
      display: "View",
      handleClick: handleView,
      icon: <FaEye style={{ color: "#1976D2" }} />, 
      disabled: true,
    },
    {
      display: "Edit",
      handleClick: handleEdit,
      icon: <EditOutlinedIcon sx={{ color: "#1976D2" }} />, 
      disabled: true,
    },
    {
      display: "Delete",
      handleClick: handleDelete,
      icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />, 
      disabled: true,
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
        <Tab style={{ textTransform: 'none' }} label="Roles " {...a11yProps(0)} />
        <Tab style={{ textTransform: 'none' }} label="Permissions " {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={rolesColumn}
            data={rolesList}
            tableHeader="Roles List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="ADD ROLES"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={rolesItem}
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
            columns={permissionColumns}
            data={permissionsList}
            tableHeader="Permissions List"
            customRightButton={false}
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="ADD PERMISSIONS"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={permissionItem}
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

export default RolesPermissionsList;