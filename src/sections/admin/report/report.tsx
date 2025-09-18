
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import StockOutReport from './stock-out/stock-out-report';
import MinimumStockReport from './minmum-stock/minimum-stock-report';
import MaximumStockReport from './maximum-stock/maximum-stock';
import VvmStageReport from './vvm-stage/vvm-stage-report';
import ColdChainReport from './cold-chain/cold-chain-status-report';

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

const ReportsSections: React.FC = () => {
  //const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const initialTab = state?.activeTab || 0;

  const [value, setValue] = useState<number>(initialTab);

  //const { data: rawUploadHistory = [] } = useFetchUploadHistory();


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };



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
        <Tab style={{ textTransform: 'none' }} label="Stock Out Report For Vaccine" {...a11yProps(0)} />
        <Tab style={{ textTransform: 'none' }} label="⁠Minimum Stock Report" {...a11yProps(1)} />
        <Tab style={{ textTransform: 'none' }} label="⁠Maximum Stock Report" {...a11yProps(2)} />
        <Tab style={{ textTransform: 'none' }} label="⁠VVM Stage Report" {...a11yProps(3)} />
        <Tab style={{ textTransform: 'none' }} label="⁠Cold Chain Status Report" {...a11yProps(4)} />

      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
            <StockOutReport />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box>
            <MinimumStockReport />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box>
            <MaximumStockReport />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box>
            <VvmStageReport />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Box>
          <ColdChainReport />
        </Box>
      </TabPanel>
      
    </>
  );
};

export default ReportsSections;