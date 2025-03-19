


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { StateType, NCSType} from "./ncs-type";

type ApiResponse<T> = {
    status: string;
    data: T;
  };

    export const useFetchNcs = () => {
        return useQuery<NCSType[], Error>({
            queryKey: ['ncs'],
            queryFn: async () => {
                const response = await apiHelper.getResource<ApiResponse<NCSType[]>>(
                    `${url}v1/ncs/`
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

    export const useUpsertNcs = () => {
        const queryClient = useQueryClient();
        return useMutation({
        mutationFn: ({ id, data }: { id?: number; data: Partial<NCSType> | Omit<NCSType, 'id'> }) =>
            id
            ? apiHelper.putResource<NCSType>(`${url}v1/ncs/${id}/`, data)
            : apiHelper.postResource<NCSType>(`${url}v1/ncs/`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ncs'] });
        },
        });
    };

    export const useDeleteNcs = () => {
        const queryClient = useQueryClient();
        return useMutation({
        mutationFn: (id: number) => 
            apiHelper.deleteResource<void>(`${url}v1/ncs/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ncs'] });
        },
        });
    };