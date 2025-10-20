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
import { apiHelper } from 'src/hooks/apis/apiHelper';
import { url } from 'src/hooks/api';
import { FaEye } from "react-icons/fa";
import { useFetchOrgLevels, useDeleteOrgLevel } from 'src/hooks/apis/org-unit/org-level-hook';
import { useDeleteOrgUnit, useFetchOrgUnits } from 'src/hooks/apis/org-unit/org-unit-hooks';

interface TableRow {
  id?: number;
  name?: string;
  description?: string;
  state?: string;
  lga?: string;
  ward?: string;
  facilty_name?: string;
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

const OrgUnitLevelList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const initialTab = state?.activeTab || 0

    const [value, setValue] = useState<number>(initialTab);
    // const [orgLevelList, setOrgLevelList] = useState<TableRow[]>([]);

    const { data: orgLevelList = [], isLoading } = useFetchOrgLevels();
    const deleteOrgLevel = useDeleteOrgLevel();

    const { data: orgUnitList = [] } = useFetchOrgUnits();
    const deleteOrgUnit = useDeleteOrgUnit();



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const unitList: TableRow[] = [];
  // const levelList: TableRow[] = [];

  const orgUnit = useMemo(
    () => [
       // {
         //    accessorKey: 'id', 
         //    header: 'ID',
         //    size: 150,
         // },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
      },
      {
        accessorKey: 'lga',
        header: 'LGA',
        size: 200,
      },
      {
        accessorKey: 'ward',
        header: 'Ward',
        size: 200,
      },
      {
        accessorKey: 'facility_name',
        header: 'Facility Name',
        size: 300,
      }
    ],
    []
  );

  const orgLevel = useMemo(
    () => [
       // {
         //    accessorKey: 'id', 
         //    header: 'ID',
         //    size: 150,
         // },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 100,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 200,
      },
    ],
    []
  );


  const getTabType = () => (value === 0 ? 'org-unit' : 'org-level');

  const handleView = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isView: true , activeTab: value} });
  };

  const handleEdit = (data: TableRow) => {
    const type = getTabType();
    navigate(`/${type}-setup`, { state: { data, isUpdate: true , activeTab: value} });
  };

  const handleDelete = (data: TableRow) => {
    if (data.id) {
      deleteOrgLevel.mutate(data.id)
    }
  };

  const handleAddNew = () => {
    const type = getTabType();
    navigate(`/${type}-setup`, {state: { activeTab: value }});
  };

  const orgUnitItem: ActionMenuItem<TableRow>[] = [
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

  const orgListItem: ActionMenuItem<TableRow>[] = [
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


  // const fetchOrgLevel = () => {
  //   apiHelper.getResource<ApiResponse<TableRow[]>>(`${url}v1/org-unit-level/`)
  //   .then((response) =>{
  //     setOrgLevelList(response.data);
  //   })
  // }

  // useEffect(() => {
  //   fetchOrgLevel()
  // }, [])

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
        <Tab style={{ textTransform: 'none' }} label="Organisation Unit" {...a11yProps(0)} />
        <Tab style={{ textTransform: 'none' }} label="Organisation Level" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={orgUnit}
            data={orgUnitList}
            tableHeader="Organisation Unit List"
            customRightButton={false}
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonText="ADD ORGANISATION UNIT"
            // customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={orgUnitItem}
            showDownloadButton={false}
          />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box>
          <VaxTable
            columns={orgLevel}
            data={orgLevelList}
            tableHeader="Organisation Level List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonText="ADD ORGANISATION LEVEL"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={orgListItem}
            showDownloadButton={false}
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default OrgUnitLevelList;