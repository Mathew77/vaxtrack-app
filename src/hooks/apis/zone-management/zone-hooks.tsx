import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { LgaType, StateType, ZoneType } from "./zoneType";

type ApiResponse<T> = {
    status: string;
    data: T;
  };


export const useFetchZoneManagement = () => {
    return useQuery<ZoneType[], Error>({
        queryKey: ['zone'],
        queryFn: async () => {
            const response = await apiHelper.getResource<ApiResponse<ZoneType[]>>(
                `${url}v1/zone/`
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

export const useUpsertZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: Partial<ZoneType> | Omit<ZoneType, 'id'> }) =>
      id
        ? apiHelper.putResource<ZoneType>(`${url}v1/zone/${id}/`, data)
        : apiHelper.postResource<ZoneType>(`${url}v1/zone/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zone'] });
    },
  });
};


export const useDeleteZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      apiHelper.deleteResource<void>(`${url}v1/zone/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zone'] });
    },
  });
};