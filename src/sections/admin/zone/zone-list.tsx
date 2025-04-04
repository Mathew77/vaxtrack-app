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
import { useDeleteZone, useFetchZoneManagement } from 'src/hooks/apis/zone-management/zone-hooks';
import { FaEye } from 'react-icons/fa';

interface TableRow {
  id?: number;
  zone_name: string;
  state: string;
  lgas: string[];
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

const ZoneList: React.FC = () => {

  const navigate = useNavigate();

  const {data: zoneList} = useFetchZoneManagement();
  const deleteZone = useDeleteZone()


  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // const zoneList: TableRow[] = [];

  const columns = useMemo(
    () => [
      {
        accessorKey: 'zone_name',
        header: 'Zone Name',
        size: 200,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
      },
      {
        accessorKey: 'lgas',
        header: 'LGA',
        size: 300,
        Cell: ({ cell }: { cell: { getValue: () => unknown } }) => {
          const lgas = cell.getValue() as string[];
          return lgas.join(',  ');
        },
      },
    ],
    []
  );


  const getTabType = () => 'zone';

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
      deleteZone.mutate(data.id);
    }
  };

  const handleAddNew = () => {
    const type = getTabType();
    navigate(`/${type}-setup`);
  };



  const zoneListItem: ActionMenuItem<TableRow>[] = [
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
        <Tab style={{ textTransform: 'none' }} label="Zone Management" {...a11yProps(0)} />
        
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={zoneList}
            tableHeader="Zone Management List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="ADD ZONE"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={zoneListItem}
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

export default ZoneList;