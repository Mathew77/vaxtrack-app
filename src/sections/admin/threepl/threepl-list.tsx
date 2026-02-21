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
import { useFetchThreePl, useDeleteThreepl } from 'src/hooks/apis/threepl/threepl-hooks';
import { useFetchEHFList } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { FaEye } from 'react-icons/fa';

interface TableRow {
  id?: number;
  state: string;
  lga: string;
  state_list: string[];
  threepl_name: string;
  ehf_list: string[];
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

const ThreeplList: React.FC = () => {
  const navigate = useNavigate();

  const { data: threepl = [], isLoading } = useFetchThreePl();
  const deleteThreepl = useDeleteThreepl();
  const { data: ehfList = [] } = useFetchEHFList();

  const ehfNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    ehfList.forEach((ehf: any) => {
      if (ehf.assigned_unique_id) {
        map[ehf.assigned_unique_id] = ehf.name_of_ehf || ehf.ehf_name || ehf.assigned_unique_id;
      }
    });
    return map;
  }, [ehfList]);

  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // const threeplList: TableRow[] = [];
  // const permissionsList: TableRow[] = [];

  const columns = useMemo(
    () => [
      {
        accessorKey: "state",
        header: "State",
        size: 100,
      },
      {
        accessorKey: "lga",
        header: "LGA",
        size: 100,
      },
      {
        accessorKey: "state_list",
        header: "State List",
        size: 200,
        Cell: ({ cell }: { cell: { getValue: () => unknown } }) => {
          const state_list = cell.getValue() as string[];
          return state_list.join(',  ')
        }
      },
      {
        accessorKey: "threepl_name",
        header: "3PL Name",
        size: 250,
        Cell: ({ row }: { row: { original: TableRow } }) => {
          return row.original.threepl_name || 'N/A';
        },
      },
      {
        accessorKey: "ehf_list",
        header: "EHF List",
        size: 200,
        Cell: ({ cell }: { cell: { getValue: () => unknown } }) => {
          const ehf_list = cell.getValue() as string[];
          return ehf_list.map((id) => ehfNameMap[id] || id).join(',  ');
        },
      },
    ],
    [ehfNameMap]
  );

  const getTabType = () => 'threepl';

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
      deleteThreepl.mutate(data.id);
    }
  };

  const handleAddNew = () => {
    const type = getTabType();
    navigate(`/${type}-setup`);
  };

  const threeplItem: ActionMenuItem<TableRow>[] = [
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
        <Tab style={{ textTransform: 'none' }} label="3PL" {...a11yProps(0)} />

      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={threepl}
            tableHeader="3PL List"
            customRightButton
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonText="ADD 3PL"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={threeplItem}
            showDownloadButton={false}
            loading={isLoading}
          />
        </Box>
      </TabPanel>

    </>
  );
};

export default ThreeplList;