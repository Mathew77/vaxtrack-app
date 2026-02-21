import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useFetchStockAtHand } from 'src/hooks/apis/upload/upload-hook';
import { StockAtHandData } from 'src/hooks/apis/upload/upload-type';

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

const UploadList: React.FC = () => {
  const navigate = useNavigate();

  const { data: stockData = [], isLoading } = useFetchStockAtHand(null);
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const uploadColumns = useMemo(
    () => [
      {
        accessorKey: 'serial_no',
        header: 'S/N',
        size: 80,
      },
      {
        accessorKey: 'assigned_unique_id',
        header: 'Unique ID',
        size: 120,
      },
      {
        accessorKey: 'name_of_ehf',
        header: 'EHF Name',
        size: 200,
      },
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
        accessorKey: 'phone_number',
        header: 'Phone Number',
        size: 130,
      },
      {
        accessorKey: 'cce_count',
        header: 'CCE Count',
        size: 80,
      },
      {
        accessorKey: 'cce_functionality_status',
        header: 'CCE Status',
        size: 120,
      },
      {
        accessorKey: 'dose_bcg',
        header: 'BCG',
        size: 80,
      },
      {
        accessorKey: 'dose_hepb',
        header: 'HepB',
        size: 80,
      },
      {
        accessorKey: 'dose_bopv',
        header: 'bOPV',
        size: 80,
      },
      {
        accessorKey: 'dose_penta',
        header: 'Penta',
        size: 80,
      },
      {
        accessorKey: 'dose_pcv',
        header: 'PCV',
        size: 80,
      },
      {
        accessorKey: 'dose_ipv',
        header: 'IPV',
        size: 80,
      },
      {
        accessorKey: 'dose_mea',
        header: 'Measles',
        size: 80,
      },
      {
        accessorKey: 'dose_yf',
        header: 'YF',
        size: 80,
      },
      {
        accessorKey: 'dose_td',
        header: 'TD',
        size: 80,
      },
      {
        accessorKey: 'dose_mena',
        header: 'MenA',
        size: 80,
      },
      {
        accessorKey: 'dose_rota',
        header: 'Rota',
        size: 80,
      },
      {
        accessorKey: 'dose_hpv',
        header: 'HPV',
        size: 80,
      },
      {
        accessorKey: 'mr',
        header: 'MR',
        size: 80,
      },
      {
        accessorKey: 'total_vaccine_storage_volume_utilized',
        header: 'Storage Used (L)',
        size: 130,
      },
      {
        accessorKey: 'remaining_cce_storage_capacity',
        header: 'Remaining Capacity (L)',
        size: 250,
      },
    ],
    []
  );

  const handleView = (data: StockAtHandData) => {
    navigate('/stock-edit-view', {
      state: {
        data: data,
        isView: true,
        isUpdate: false,
      },
    });
  };

  const handleEdit = (data: StockAtHandData) => {
    navigate('/stock-edit-view', {
      state: {
        data: data,
        isView: false,
        isUpdate: true,
      },
    });
  };

  const handleDelete = (data: StockAtHandData) => {
    console.log('Delete stock:', data);
    // Coming: Implement delete functionality
  };

  const handleAddNew = () => {
    navigate('/upload-view');
  };

  const uploadActionItems: ActionMenuItem<StockAtHandData>[] = [
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
        <Tab style={{ textTransform: 'none' }} label="Maximum Stock" {...a11yProps(0)} />

      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={uploadColumns}
            data={stockData}
            tableHeader="Maximum Stock"
            customRightButton
            customRightButtonIcon={<CloudUploadOutlinedIcon />}
            customRightButtonText="Upload Stockss"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={uploadActionItems}
            showDownloadButton={false}
            loading={isLoading}
          />
        </Box>
      </TabPanel>

    </>
  );
};

export default UploadList;