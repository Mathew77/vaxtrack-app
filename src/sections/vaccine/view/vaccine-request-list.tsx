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
import { useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';

interface VaccineRequestTableRow {
  id?: number;
  ehf_name: string;
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
  1: 'Vaccine Approved by LCS',
  2: 'Vaccine Declined by LCS',
  3: 'Vaccine Approved by SLWG',
  4: 'Vaccine Declined by SLWG',
  5: 'Vaccine Approved by SCS',
  6: 'Vaccine Declined by SCS',
  7: 'Vaccine Approved by ThreePL',
  8: 'Order Completed',
  9: 'Vaccine Declined by ThreePL',
};

const VaccineRequestList: React.FC = () => {
  const navigate = useNavigate();

  const { data: vaccineRequests = [] } = useFetchRequest();
  const deleteVaccineRequest = useDeleteVaccineRequest();
  const { data: users = [] } = useFetchUsers();
  const { data: ehfs = [] } = useFetchEHF();
  const { data: scs = [] } = useFetchScs();
  const { data: lcs = [] } = useFetchLcs();

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
  const isEHF = userRole === 'ehf';
  const isLCS = userRole === 'lcs';

  // console.log('User Role:', userRole);
  // console.log('User Role:', isSLWG);
  // console.log('User Role:', isThreePL);
  // console.log('User Role:', isSSC);

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

  const userLcsList = useMemo(() => {
    try {
      const lcsListData = sessionStorage.getItem('lcs_list');
      if (lcsListData) {
        const parsed = JSON.parse(lcsListData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing lcs_list from session storage:', error);
      return [];
    }
  }, []);

  const userLcsId = userLcsList[0]?.toString() || '';

  const userLcsState = useMemo(() => {
    if (!userLcsId || !lcs.length) return null;
    
    const userLcs = lcs.find((lcsItem: any) => lcsItem.id?.toString() === userLcsId?.toString());
    return userLcs?.stat_id || null;
  }, [userLcsId, lcs]);

  // const allowedEhfIds = useMemo(() => {
  //   if (isSLWG && userScsState) {
  //     return ehfs
  //       .filter((ehf: any) => ehf.state === userScsState)
  //       .map((ehf: any) => ehf.id?.toString())
  //       .filter((id: any): id is string => !!id);
  //   }
  //   return [];
  // }, [isSLWG, userScsState, ehfs]);

  const allowedSlwgEhfIds = useMemo(() => {
    if (isSLWG && userScsState) {
      return ehfs
        .filter((ehf: any) => ehf.state === userScsState)
        .map((ehf: any) => ehf.id?.toString())
        .filter((id: any): id is string => !!id);
    }
    return [];
  }, [isSLWG, userScsState, ehfs]);

  const allowedLcsEhfIds = useMemo(() => {
    if (isLCS && userLcsState) {
      return ehfs
        .filter((ehf: any) => ehf.state === userLcsState)
        .map((ehf: any) => ehf.id?.toString())
        .filter((id: any): id is string => !!id);
    }
    return [];
  }, [isLCS, userLcsState, ehfs]);

  const allowedScsEhfIds = useMemo(() => {
    if (isSSC && userScsState) {
      return ehfs
        .filter((ehf: any) => ehf.state === userScsState)
        .map((ehf: any) => ehf.id?.toString())
        .filter((id: any): id is string => !!id);
    }
    return [];
  }, [isSSC, userScsState, ehfs]);

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

    if (isLCS) {
      if (allowedLcsEhfIds.length === 0) return [];
      baseFilteredRequests = vaccineRequests.filter((request: VaccineFormType) => {
        const statusNumber = convertVaccineStatusToNumber(request.vaccine_status);
        return allowedLcsEhfIds.includes(String(request.ehf_id)) &&
          (statusNumber === 0 || statusNumber === 1 || statusNumber === 2 ||
            statusNumber === 3 || statusNumber === 4 || statusNumber === 5 || statusNumber === 6 ||
            statusNumber === 7 || statusNumber === 8);
      });
    } else if (isSLWG) {
      if (allowedSlwgEhfIds.length === 0) return [];
      baseFilteredRequests = vaccineRequests.filter((request: VaccineFormType) => {
        const statusNumber = convertVaccineStatusToNumber(request.vaccine_status);
        return allowedSlwgEhfIds.includes(String(request.ehf_id)) &&
          (statusNumber === 1 || statusNumber === 3 || statusNumber === 4 ||
            statusNumber === 5 || statusNumber === 6 || statusNumber === 7 || statusNumber === 8); // Removed status 0 - SLWG should only see after LCS approval
      });
    } else if (isSSC) {
      if (allowedScsEhfIds.length === 0) return [];
      baseFilteredRequests = vaccineRequests.filter((request: VaccineFormType) => {
        const statusNumber = convertVaccineStatusToNumber(request.vaccine_status);
        return allowedScsEhfIds.includes(String(request.ehf_id)) &&
              (statusNumber === 3 || statusNumber === 5 || statusNumber === 6 ||
                statusNumber === 7 || statusNumber === 8); // Removed status 4 (SLWG declined) - SCS shouldn't see declined requests
      });
    } else if (isThreePL) {
      baseFilteredRequests = vaccineRequests.filter((request: VaccineFormType) => {
        const statusNumber = convertVaccineStatusToNumber(request.vaccine_status);
        return statusNumber === 5 || statusNumber === 7 || statusNumber === 8 || statusNumber === 9;
      });
    } else if (isEHF) {
      if (!userEhfId) return [];
      baseFilteredRequests = vaccineRequests.filter((request: VaccineFormType) => 
        String(request.ehf_id) === userEhfId
      );
    } else {
      baseFilteredRequests = vaccineRequests;
    }

    return baseFilteredRequests;
  }, [
    vaccineRequests, 
    isLCS, 
    isSLWG, 
    isSSC, 
    isThreePL, 
    isEHF, 
    allowedLcsEhfIds, 
    allowedSlwgEhfIds, 
    allowedScsEhfIds, 
    userEhfId
  ]);

  const transformedVaccineRequests: VaccineRequestTableRow[] = useMemo(() => {
    return filteredVaccineRequests.map((request: VaccineFormType) => {
      return {
        id: request.id,
        ehf_name: String(request.ehf_name || 'Unknown EHF'),
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
    if ((isEHF) && data.id) {
      deleteVaccineRequest.mutate(data.id, {
        onSuccess: () => {
          toast.success('Vaccine request deleted successfully');
        },
        onError: (error: any) => {
          toast.error('Failed to delete vaccine request');
        },
      });
    } else {
      toast.error('You are not authorized to delete this request or the request cannot be deleted');
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
        accessorKey: 'ehf_name',
        header: 'EHF Name',
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<VaccineRequestTableRow, unknown> }) => {
          const ehfName = cell.getValue() as string | undefined;
          return ehfName || 'Unknown EHF';
        },
      },
      // {
      //   accessorKey: 'ehf_id',
      //   header: 'EHF ID',
      //   size: 100,
      //   Cell: ({ cell }: { cell: MRT_Cell<VaccineRequestTableRow, unknown> }) => {
      //     const ehfId = cell.getValue() as string | number | undefined;
      //     return ehfId ? String(ehfId) : 'N/A';
      //   },
      // },
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

  const actionMenuItems: ActionMenuItem<VaccineRequestTableRow>[] = useMemo(() => {
    const items: ActionMenuItem<VaccineRequestTableRow>[] = [];

    if (isEHF) {
      items.push({
        display: "View",
        handleClick: handleView,
        icon: <FaEye style={{ color: "#1976D2" }} />,
      });
      items.push({
        display: "Delete",
        handleClick: handleDelete,
        icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
      });
    } else if (isLCS) {
        items.push({
          display: "View / Approve",
          handleClick: handleView,
          icon: <FaEye style={{ color: "#1976D2" }} />,
        });
      }  else if (isSLWG) {
      items.push({
        display: "View / Approve",
        handleClick: handleView,
        icon: <FaEye style={{ color: "#1976D2" }} />,
      });
    } else if (isSSC) {
      items.push({
        display: "View / Approve",
        handleClick: handleView,
        icon: <FaEye style={{ color: "#1976D2" }} />,
      });
    } else if (isThreePL) {
      items.push({
        display: "View / Pick",
        handleClick: handleView,
        icon: <FaEye style={{ color: "#1976D2" }} />,
      });
    } else {
      items.push({
        display: "View",
        handleClick: handleView,
        icon: <FaEye style={{ color: "#1976D2" }} />,
      });
    }

    return items;
  }, [isEHF, isSLWG, isThreePL]);

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
            customRightButtonText="ADD VACCINE REQUEST"
            customRightButtonCallBackFunction={handleAddNew}
            actionMenuItems={actionMenuItems}
            headerStyles={{
              backgroundColor: '#1976D2',
              color: 'white',
              fontSize: '16px',
            }}
            showDownloadButton={false}
          />
        </Box>
      </TabPanel>
    </>
  );
};

export default VaccineRequestList;