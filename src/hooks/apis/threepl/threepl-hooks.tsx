import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { LgaType, StateType, ThreePlType, WardType  } from "./threepl-type";

type ApiResponse<T> = {
    status: string;
    data: T;
  };

export const useFetchThreePl = () => {
    return useQuery<ThreePlType[], Error>({
        queryKey: ['threepl'],
        queryFn: async () => {
            const response = await apiHelper.getResource<ApiResponse<ThreePlType[]>>(
                `${url}v1/threepl/`
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


  export const useFetchEHFs = (state: string, lga?: string) => {
    return useQuery({
      queryKey: ['ehfs', state, lga],
      queryFn: async (): Promise<any[]> => {
        if (!state) return [];

        try {
          let apiUrl = `${url}v1/ehf-detail-routes/?state=${encodeURIComponent(state.trim())}`;

          if (lga && lga.trim()) {
            apiUrl += `&lga=${encodeURIComponent(lga.trim())}`;
          }

          const response = await apiHelper.getResource<any[]>(apiUrl);

          return Array.isArray(response) ? response : [];
        } catch (error) {
          console.error('API Error - Fetch EHFs for 3PL:', error);
          return [];
        }
      },
      enabled: !!state,
    });
  };

    export const useUpsertThreepl = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, data }: { id?: number; data: Partial<ThreePlType> | Omit<ThreePlType, 'id'> }) =>
          id
            ? apiHelper.putResource<ThreePlType>(`${url}v1/threepl/${id}/`, data)
            : apiHelper.postResource<ThreePlType>(`${url}v1/threepl/`, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['threepl'] });
        },
      });
    };


    export const useDeleteThreepl = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (id: string | number) => 
          apiHelper.deleteResource<void>(`${url}v1/threepl/${id}/`),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['threepl'] });
        },
      });
    };

    
