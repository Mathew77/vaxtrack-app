import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { StateType, SCSType } from "./scs-type";

type ApiResponse<T> = {
    status: string;
    data: T;
  };


export const useFetchScs = () => {
    return useQuery<SCSType[], Error>({
        queryKey: ['scs'],
        queryFn: async () => {
            const response = await apiHelper.getResource<ApiResponse<SCSType[]>>(
                `${url}v1/scs/`
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

export const useUpsertScs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: Partial<SCSType> | Omit<SCSType, 'id'> }) =>
      id
        ? apiHelper.putResource<SCSType>(`${url}v1/scs/${id}/`, data)
        : apiHelper.postResource<SCSType>(`${url}v1/scs/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scs'] });
    },
  });
};


export const useDeleteScs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      apiHelper.deleteResource<void>(`${url}v1/scs/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scs'] });
    },
  });
};

export const useFetchLcsEhf = () => {
  return useQuery<any[], Error>({
    queryKey: ['lcs-ehf'],
    queryFn: async () => {
      const response = await apiHelper.getResource<any[]>(
        `${url}v1/ehf-detail-routes/`
      );
      return Array.isArray(response) ? response : [];
    },
  });
}