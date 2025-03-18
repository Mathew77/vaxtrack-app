import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { LgaType, StateType, LcsType } from "./lcs-type";

type ApiResponse<T> = {
    status: string;
    data: T;
  };


export const useFetchLcs = () => {
    return useQuery<LcsType[], Error>({
        queryKey: ['lcco'],
        queryFn: async () => {
            const response = await apiHelper.getResource<ApiResponse<LcsType[]>>(
                `${url}v1/lcco/`
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
export const useUpsertLcs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: Partial<LcsType> | Omit<LcsType, 'id'> }) =>
      id
        ? apiHelper.putResource<LcsType>(`${url}v1/lcco/${id}/`, data)
        : apiHelper.postResource<LcsType>(`${url}v1/lcco/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lcco'] });
    },
  });
};


export const useDeleteLcs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      apiHelper.deleteResource<void>(`${url}v1/lcco/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lcco'] });
    },
  });
};