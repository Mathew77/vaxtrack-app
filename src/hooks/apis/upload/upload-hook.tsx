import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { url } from '../../api';
import { UploadResponse, StockAtHandData, AllocationSubmitData, AllocatedVaccineData } from './upload-type';

type ApiResponse<T> = {
  status: string;
  data: T;
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
  });
};

export const useSubmitAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AllocationSubmitData) => {
      const response = await apiHelper.postResource<any>(
        `${url}v1/vaccine-allocation-stock/`,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-allocation-stock'] });
    },
  });
};

export const useFetchAllocatedVaccines = (state?: string | null) => {
  return useQuery<AllocatedVaccineData[], Error>({
    queryKey: ['vaccine-allocation-stock', state],
    queryFn: async () => {
      const queryParam = state ? `?state=${state}` : '';
      const response = await apiHelper.getResource<any>(`${url}v1/vaccine-allocation-stock/${queryParam}`);
      return response.data || response;
    },
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
