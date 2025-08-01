import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { FaEye } from 'react-icons/fa';
import type { MRT_Cell } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { useFetchRequest, useDeleteVaccineRequest, useFetchUsers, useFetchEHF } from 'src/hooks/apis/ehf/ehf-hooks';
import { VaccineFormType } from 'src/hooks/apis/ehf/ehf-type';
import { toast } from 'react-toastify';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';

interface VaccineRequestTableRow {
  id?: number;
  ehf_id: string;
  requested_by: string;
  vaccine_status: number;
  created_at?: string;
  updated_at?: string;
  product_detail_request: Array<{
    type: string;
    [key: string]: any;
  }>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}


const convertVaccineStatusToNumber = (status: string | number | undefined): number => {
  if (typeof status === 'string') {
    return parseInt(status, 10) || 0;
  }
  return typeof status === 'number' ? status : 0;
};

const convertVaccineStatusToString = (status: string | number | undefined): string => {
  return String(status || 0);
};

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

const statusDisplayMap: { [key: number]: string } = {
  0: 'Vaccine Requested by EHF',
  1: 'Vaccine Approved by SLWG',
  2: 'Vaccine Declined by SLWG',
  3: 'Vaccine Picked by ThreePL',
  4: 'Order Completed',
};

const VaccineRequestList: React.FC = () => {
  const navigate = useNavigate();

  const { data: vaccineRequests = [] } = useFetchRequest();
  const deleteVaccineRequest = useDeleteVaccineRequest();
  const { data: users = [] } = useFetchUsers();
  const { data: ehfs = [] } = useFetchEHF();
  const { data: scs = [] } = useFetchScs();

  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const userRole = useMemo(() => {
    return sessionStorage.getItem('userRole') || '';
  }, []);

  const isSLWG = userRole === 'slwg';
  const isThreePL = userRole === 'threepl';
  const isSSC = userRole === 'scs';

  console.log('User Role:', userRole);
  console.log('User Role:', isSLWG);
  console.log('User Role:', isThreePL);
  console.log('User Role:', isSSC);

  // Get SCS list from session storage
  const userScsList = useMemo(() => {
    try {
      const scsListData = sessionStorage.getItem('scs_list');
      if (scsListData) {
        const parsed = JSON.parse(scsListData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing scs_list from session storage:', error);
      return [];
    }
  }, []);

  const userScsId = userScsList[0];

  const userScsState = useMemo(() => {
    if (!userScsId || !scs.length) return null;
    
    const userScs = scs.find((scsItem: any) => scsItem.id?.toString() === userScsId?.toString());
    return userScs?.stat_id || null;
  }, [userScsId, scs]);

  const allowedEhfIds = useMemo(() => {
    if (isSLWG && userScsState) {
      return ehfs
        .filter((ehf: any) => ehf.state === userScsState)
        .map((ehf: any) => ehf.id?.toString())
        .filter((id: any): id is string => !!id);
    }
    return [];
  }, [isSLWG, userScsState, ehfs]);

  const userEhfList = useMemo(() => {
    try {
      const ehfListData = sessionStorage.getItem('ehf_list');
      if (ehfListData) {
        const parsed = JSON.parse(ehfListData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing ehf_list from session storage:', error);
      return [];
    }
  }, []);

  const userEhfId = userEhfList[0]?.toString() || '';

  const filteredVaccineRequests = useMemo(() => {
    let baseFilteredRequests: VaccineFormType[] = [];

    if (isSLWG) {
      if (allowedEhfIds.length === 0) return [];
      baseFilteredRequests = vaccineRequests.filter((request: VaccineFormType) => 
        allowedEhfIds.includes(String(request.ehf_id))
      );
    } else {
      if (!userEhfId) {
        baseFilteredRequests = vaccineRequests;
      } else {
        baseFilteredRequests = vaccineRequests.filter((request: VaccineFormType) => 
          String(request.ehf_id) === userEhfId
        );
      }
    }

    if (isThreePL || isSSC) {
      return baseFilteredRequests.filter((request: VaccineFormType) => {
        const statusNumber = convertVaccineStatusToNumber(request.vaccine_status);
        return statusNumber === 1 || statusNumber === 3;
      });
    }

    return baseFilteredRequests;
  }, [vaccineRequests, isSLWG, allowedEhfIds, userEhfId, isThreePL, isSSC]);

  const transformedVaccineRequests: VaccineRequestTableRow[] = useMemo(() => {
    return filteredVaccineRequests.map((request: VaccineFormType) => {
      return {
        id: request.id,
        ehf_id: String(request.ehf_id),
        requested_by: request.requested_by,
        vaccine_status: convertVaccineStatusToNumber(request.vaccine_status),
        product_detail_request: request.product_detail_request || [],
      };
    });
  }, [filteredVaccineRequests]);

  const handleView = (data: VaccineRequestTableRow) => {
    const initialData = {
      id: data.id,
      ehf_id: String(data.ehf_id),
      requested_by: data.requested_by,
      product_detail_request: data.product_detail_request || [],
      vaccine_status: data.vaccine_status, 
    } as VaccineFormType;
    navigate(`/vaccine-request-view`, {
      state: {
        initialData,
        isView: true,
        editId: data.id?.toString(),
      },
    });
  };

  const handleDelete = (data: VaccineRequestTableRow) => {
    if (data.id) {
      deleteVaccineRequest.mutate(data.id, {
        onSuccess: () => {
          toast.success('Vaccine request deleted successfully');
        },
        onError: (error: any) => {
          toast.error('Failed to delete vaccine request');
        },
      });
    }
  };

  const handleAddNew = () => {
    navigate('/vaccine-request-view');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Request ID",
        size: 100,
      },
      {
        accessorKey: 'ehf_id',
        header: 'EHF ID',
        size: 100,
        Cell: ({ cell }: { cell: MRT_Cell<VaccineRequestTableRow, unknown> }) => {
          const ehfId = cell.getValue() as string | number | undefined;
          return ehfId ? String(ehfId) : 'N/A';
        },
      },
      {
        accessorKey: 'vaccine_status',
        header: 'Status',
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<VaccineRequestTableRow, unknown> }) => {
          const statusValue = Number(cell.getValue());
          return statusDisplayMap[statusValue] || `Unknown Status (${statusValue})`;
        },
      },
    ],
    []
  );

  const actionMenuItems: ActionMenuItem<VaccineRequestTableRow>[] = [
    {
      display: "View / Approve",
      handleClick: handleView,
      icon: <FaEye style={{ color: "#1976D2" }} />,
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
        <Tab style={{ textTransform: 'none' }} label="Vaccine Requests - Management" {...a11yProps(0)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box>
          <VaxTable
            columns={columns}
            data={transformedVaccineRequests}
            tableHeader="Vaccine Request - Summary Page"
            customRightButton={userEhfId}
            customRightButtonIcon={<AddOutlinedIcon />}
            customRightButtonStyles={{ backgroundColor: 'black', color: '#fff', padding: 4, borderRadius: 2 }}
            customRightButtonText="ADD Vaccine Allocation"
            customRightButtonCallBackFunction={handleAddNew}
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

export default VaccineRequestList;