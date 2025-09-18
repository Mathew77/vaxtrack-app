import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { StateType, LgaType, WardType } from "./report-type";


type ApiResponse<T> = {
    status: string;
    data: T;
  };


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