import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { LgaType, StateType, EHFType, WardType, OrgUnit  } from "./ehf-type";

type ApiResponse<T> = {
    status: string;
    data: T;
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

export const useFetchStates = () => {
    return useQuery({
      queryKey: ['states'],
      queryFn: async (): Promise<StateType[]> => {
        const response = await apiHelper.getResource<StateType[]>(
            `${url}v1/states/`
        );
        return response; 
      },
    });
  };

  export const useFetchLgas = (state: string) => {
    return useQuery({
      queryKey: ['lgas', state],
      queryFn: async (): Promise<LgaType[]> => {
        if (!state) return []; 
        const response = await apiHelper.getResource<LgaType[]>(
          `${url}v1/lgas/?state=${state}`
        );
        return response;
      },
      enabled: !!state, 
    });
  };

  export const useFetchWards = (lga: string) => {
    return useQuery({
      queryKey: ['wards', lga],
      queryFn: async (): Promise<WardType[]> => {
        if (!lga) return []; 
        const response = await apiHelper.getResource<WardType[]>(
          `${url}v1/wards/?lga=${lga}`
        );
        return response;
      },
      enabled: !!lga, 
    });
  };    

    export const useFetchOrgUnits = () => {
        return useQuery<OrgUnit[], Error>({
            queryKey: ['orgUnits'],
            queryFn: async () => {
            const response = await apiHelper.getResource<ApiResponse<OrgUnit[]>>(`${url}v1/org-unit-level/`);
            return response.data;
            },
        });
    };


    export const useUpsertEHF = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, data }: { id?: number; data: Partial<EHFType> | Omit<EHFType, 'id'> }) =>
          id
            ? apiHelper.putResource<EHFType>(`${url}v1/ehf/${id}/`, data)
            : apiHelper.postResource<EHFType>(`${url}v1/ehf/`, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['ehf'] });
        },
      });
    };

    export const useDeleteEHF = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (id: number) => 
          apiHelper.deleteResource<void>(`${url}v1/ehf/${id}/`),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['ehf'] });
        },
      });
    };