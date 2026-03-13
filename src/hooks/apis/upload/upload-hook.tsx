import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { url } from '../../api';
import { UploadResponse, StockAtHandData, AllocationSubmitData, AllocatedVaccineData, BulkAllocationSubmitData } from './upload-type';

type ApiResponse<T> = {
  status: string;
  data: T;
};

export const useUploadUHFData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await apiHelper.postResource<UploadResponse>(
        `${url}v1/uhf/upload-excel/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uhf'] });
    },
  });
};

export const useUploadStockData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await apiHelper.postResource<UploadResponse>(
        `${url}v1/ehf-stock-at-hand/upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ehf-stock-at-hand'] });
    },
  });
};

export const useFetchStockAtHand = (state?: string | null) => {
  return useQuery<StockAtHandData[], Error>({
    queryKey: ['ehf-stock-at-hand', state],
    queryFn: async () => {
      const queryParam = state ? `?state=${state}` : '';
      const response = await apiHelper.getResource<any>(`${url}v1/ehf-stock-at-hand/${queryParam}`);
      return response.data || response;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache kept for 10 minutes
  });
};

export const useSubmitAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AllocationSubmitData | AllocationSubmitData[] | BulkAllocationSubmitData) => {
      const response = await apiHelper.postResource<any>(
        `${url}v1/vaccine-allocation-stock/batch-upsert/`,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-stock'] });
    },
  });
};

export const useFetchAllocatedVaccines = () => {
  return useQuery<AllocatedVaccineData[], Error>({
    queryKey: ['vaccine-allocation-stock'],
    queryFn: async () => {
      const response = await apiHelper.getResource<any>(`${url}v1/vaccine-allocation-stock/batch-summary-nested/`);
      return response.results || response.data || response;
    },
  });
};

// Fetch all individual allocations (not aggregated) to get facility count and threepl per batch
export const useFetchAllIndividualAllocations = () => {
  return useQuery<AllocatedVaccineData[], Error>({
    queryKey: ['vaccine-allocation-stock-all'],
    queryFn: async () => {
      const response = await apiHelper.getResource<any>(`${url}v1/vaccine-allocation-stock/batch-upsert/`);
      return response.results || response.data || response;
    },
  });
};

export const useFetchBatchAllocations = (batchNo?: string | null) => {
  return useQuery<AllocatedVaccineData[], Error>({
    queryKey: ['vaccine-allocation-batch', batchNo],
    queryFn: async () => {
      if (!batchNo) return [];
      const response = await apiHelper.getResource<any>(`${url}v1/vaccine-allocation-stock/batch-upsert/?batch_no=${batchNo}`);
      return response.results || response.data || response;
    },
    enabled: !!batchNo,
  });
};

export const useUpdateStockData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { id, ...updateData } = data;
      const response = await apiHelper.putResource<any>(
        `${url}v1/ehf-stock-at-hand/${id}/`,
        updateData
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ehf-stock-at-hand'] });
    },
  });
};

export const useUpdateAllocationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, data }: { id: number; status: number; data: any }) => {
      const updateData = {
        ...data,
        status,
      };
      const response = await apiHelper.putResource<any>(
        `${url}v1/vaccine-allocation-stock/${id}/`,
        updateData
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-stock'] });
    },
  });
};

export const useDeleteAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiHelper.deleteResource<any>(
        `${url}v1/vaccine-allocation-stock/${id}/`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-stock'] });
    },
  });
};

export const useDeleteAllocationByBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batch_no: string) => {
      const response = await apiHelper.deleteResource<any>(
        `${url}v1/vaccine-allocation-stock/batch-upsert/?batch_no=${batch_no}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-stock'] });
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-stock-all'] });
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-batch'] });
    },
  });
};

export const useDeleteAllocationByFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigned_unique_id: string) => {
      const response = await apiHelper.deleteResource<any>(
        `${url}v1/vaccine-allocation-stock/batch-upsert/?assigned_unique_id=${assigned_unique_id}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-batch'] });
      queryClient.invalidateQueries({ queryKey: ['allocated-vaccines'] });
    },
  });
};

export const useDeleteAllocationByPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assigned_unique_id, period }: { assigned_unique_id: string; period: string }) => {
      const response = await apiHelper.deleteResource<any>(
        `${url}v1/vaccine-allocation-stock/batch-upsert/?assigned_unique_id=${assigned_unique_id}&period=${period}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-batch'] });
      queryClient.invalidateQueries({ queryKey: ['allocated-vaccines'] });
    },
  });
};

// Bulk update allocation status for 3PL bulk pickup
export const useBulkUpdateAllocationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ allocations, status, vvmStages }: {
      allocations: AllocatedVaccineData[];
      status: number;
      vvmStages?: Record<string, Record<string, string>>;
    }) => {
      // Update each allocation in parallel
      const results = await Promise.all(
        allocations.map(async (allocation) => {
          const allocationVvmStages = vvmStages?.[allocation.id?.toString() || ''] || {};

          const updateData: any = {
            uuid: allocation.uuid,
            assigned_unique_id: allocation.assigned_unique_id,
            period: allocation.period,
            dose_bcg_actual: allocation.dose_bcg_actual,
            dose_bcg_allocated: allocation.dose_bcg_allocated,
            dose_hepb_actual: allocation.dose_hepb_actual,
            dose_hepb_allocated: allocation.dose_hepb_allocated,
            dose_bopv_actual: allocation.dose_bopv_actual,
            dose_bopv_allocated: allocation.dose_bopv_allocated,
            dose_penta_actual: allocation.dose_penta_actual,
            dose_penta_allocated: allocation.dose_penta_allocated,
            dose_pcv_actual: allocation.dose_pcv_actual,
            dose_pcv_allocated: allocation.dose_pcv_allocated,
            dose_ipv_actual: allocation.dose_ipv_actual,
            dose_ipv_allocated: allocation.dose_ipv_allocated,
            dose_mea_actual: allocation.dose_mea_actual,
            dose_mea_allocated: allocation.dose_mea_allocated,
            dose_yf_actual: allocation.dose_yf_actual,
            dose_yf_allocated: allocation.dose_yf_allocated,
            dose_td_actual: allocation.dose_td_actual,
            dose_td_allocated: allocation.dose_td_allocated,
            dose_mena_actual: allocation.dose_mena_actual,
            dose_mena_allocated: allocation.dose_mena_allocated,
            dose_rota_actual: allocation.dose_rota_actual,
            dose_rota_allocated: allocation.dose_rota_allocated,
            dose_hpv_actual: allocation.dose_hpv_actual,
            dose_hpv_allocated: allocation.dose_hpv_allocated,
            status,
          };

          // Include VVM stages for 3PL confirmation - only for vaccines with allocations > 0
          if (allocation.dose_bcg_allocated > 0) updateData.bcg_vvm_stage_threepl = allocationVvmStages.bcg || '';
          if (allocation.dose_hepb_allocated > 0) updateData.hepb_vvm_stage_threepl = allocationVvmStages.hepb || '';
          if (allocation.dose_bopv_allocated > 0) updateData.bopv_vvm_stage_threepl = allocationVvmStages.bopv || '';
          if (allocation.dose_penta_allocated > 0) updateData.penta_vvm_stage_threepl = allocationVvmStages.penta || '';
          if (allocation.dose_pcv_allocated > 0) updateData.pcv_vvm_stage_threepl = allocationVvmStages.pcv || '';
          if (allocation.dose_ipv_allocated > 0) updateData.ipv_vvm_stage_threepl = allocationVvmStages.ipv || '';
          if (allocation.dose_mea_allocated > 0) updateData.mea_vvm_stage_threepl = allocationVvmStages.mea || '';
          if (allocation.dose_yf_allocated > 0) updateData.yf_vvm_stage_threepl = allocationVvmStages.yf || '';
          if (allocation.dose_td_allocated > 0) updateData.td_vvm_stage_threepl = allocationVvmStages.td || '';
          if (allocation.dose_mena_allocated > 0) updateData.mena_vvm_stage_threepl = allocationVvmStages.mena || '';
          if (allocation.dose_rota_allocated > 0) updateData.rota_vvm_stage_threepl = allocationVvmStages.rota || '';
          if (allocation.dose_hpv_allocated > 0) updateData.hpv_vvm_stage_threepl = allocationVvmStages.hpv || '';

          const response = await apiHelper.putResource<any>(
            `${url}v1/vaccine-allocation-stock/${allocation.id}/`,
            updateData
          );
          return response;
        })
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-stock'] });
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-batch'] });
    },
  });
};
