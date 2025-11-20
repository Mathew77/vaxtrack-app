import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { VaccineAllocationType, VaccineFormType } from "./ehf-type";
import { UserType } from "../user/user-types";
import { EHFType } from "../ehf-uhf/ehf-type";
import { UHFType } from "./ehf-type";

type ApiResponse<T> = {
    status: string;
    data: T;
  };

  export const useFetchRequest = () => {
      return useQuery<VaccineFormType[], Error>({
          queryKey: ['vaccine'],
          queryFn: async () => {
              const response = await apiHelper.getResource<ApiResponse<VaccineFormType[]>>(
                  `${url}v1/vaccine-request/`
              )
              return response.data
          } 
      })
  }

  export const useCreateVaccine = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: VaccineFormType) =>
        apiHelper.postResource<VaccineFormType>(`${url}v1/vaccine-request/`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vaccine'] }); 
      },
    });
  };

  export const useUpdateVaccineRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<VaccineFormType> }) =>
        apiHelper.putResource<VaccineFormType>(`${url}v1/vaccine-request/${id}/`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vaccine'] });
      },
    });
  };

  export const useFetchUsers = () => {
    return useQuery<UserType[], Error>({
      queryKey: ['user'],
      queryFn: async () => {
        try {
          const response = await apiHelper.getResource<ApiResponse<UserType[]>>(`${url}v1/user/`);   
          const usersWithEhf = response.data.filter(user => 
            user.ehf_list && user.ehf_list.length > 0
          );
          return usersWithEhf.length > 0 ? usersWithEhf : response.data;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },

    });
  };

  export const useFetchAllocation = () => {
  return useQuery<VaccineAllocationType[], Error>({
    queryKey: ['vaccine-allocations'], 
    queryFn: async () => {
      const response = await apiHelper.getResource<ApiResponse<VaccineAllocationType[]>>(
        `${url}v1/vaccine-allocation/`
      );
      return response.data.map((allocation) => ({
        ...allocation,
        vaccines_allocation_detail: Array.isArray(allocation.vaccines_allocation_detail)
          ? allocation.vaccines_allocation_detail
          : [],
      }));
    },
  });
};

  export const useCreateAllocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id?: number; data: Partial<VaccineAllocationType> | Omit<VaccineAllocationType, "id"> }) =>
        id
          ? apiHelper.putResource<VaccineAllocationType>(`${url}v1/vaccine-allocation/${id}/`, data)
          : apiHelper.postResource<VaccineAllocationType>(`${url}v1/vaccine-allocation/`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vaccine'] });
      },
    });
  };

  export const useFetchEHF = () => {
      return useQuery<EHFType[], Error>({
          queryKey: ['ehf'],
          queryFn: async () => {
              const response = await apiHelper.getResource<ApiResponse<EHFType[]>>(
                  `${url}v1/ehf/`
              )
              return response.data
          } 
      })
  }

  export const useFetchUHF = (ehfId: number | null) => {
    return useQuery<UHFType[], Error>({
      queryKey: ['uhf', ehfId],
      queryFn: async () => {
        if (!ehfId) {
          return [];
        }
        try {
          const response = await apiHelper.getResource<ApiResponse<{
            uhf_list: string[];
            [key: string]: any;
          }>>(`${url}v1/ehf/${ehfId}/`);
          const uhfList = response.data.uhf_list || [];
          if (!Array.isArray(uhfList) || uhfList.length === 0) {
            return [];
          }

          // Fetch UHF details for each ID
          const uhfDetails = uhfList.map(async (uhfId) => {
            try {
              const uhfResponse = await apiHelper.getResource<ApiResponse<UHFType>>(
                `${url}v1/uhf/${uhfId}/`
              );
              return uhfResponse.data;
            } catch (error) {
              console.error(`Error fetching UHF ${uhfId}:`, error);
              return null;
            }
          });

          const uhfData = await Promise.all(uhfDetails);
          return uhfData.filter((uhf): uhf is UHFType => uhf !== null);
        } catch (error) {
          console.error('Error fetching UHF data:', error);
          return [];
        }
      },
      enabled: !!ehfId,
    });
  };

  export const useDeleteAllocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) =>
        apiHelper.deleteResource<void>(`${url}v1/vaccine-allocation/${id}/`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vaccine-allocations'] });
      },
    });
  }

    export const useDeleteVaccineRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) =>
        apiHelper.deleteResource<void>(`${url}v1/vaccine-request/${id}/`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vaccine'] });
      },
    });
  }
  
