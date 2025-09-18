import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../../utils/VaxTablePage'; 

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

const mockData = [
  { 
    id: 1, 
    state: 'Lagos', 
    lga: 'Ikeja', 
    ward: 'GRA', 
    address: '123 Allen Avenue, Ikeja, Lagos' 
  },
  { 
    id: 2, 
    state: 'Rivers', 
    lga: 'Rivers Municipal', 
    ward: 'Rivers II', 
    address: '45 Ademola Adetokunbo Crescent,  Rivers' 
  },
  { 
    id: 3, 
    state: 'Rivers', 
    lga: 'Port Harcourt', 
    ward: 'Old GRA', 
    address: '8A Forces Avenue, Old GRA, Port Harcourt' 
  },
];

const MinimumStockReport: React.FC = () => {
  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'state',
        header: 'State',
        size: 200,
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
        accessorKey: 'address',
        header: 'Address',
        size: 200,
      },
    ],
    []
  );

  return (
    <>
      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={mockData}
            tableHeader=""
            customRightButton={false}
            headerStyles={{
              backgroundColor: '#1976D2',
              color: 'white',
              fontSize: '16px',
            }}
            showDownloadButton={true}
            exportFileName="minimum-stock-report"
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default MinimumStockReport;