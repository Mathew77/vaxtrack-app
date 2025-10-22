import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { LgaType, StateType, UHFType, WardType, OrgUnit, HFAType  } from "./uhf-type";

type ApiResponse<T> = {
    status: string;
    data: T;
  };

export const useFetchUHF = () => {
    return useQuery<UHFType[], Error>({
        queryKey: ['uhf'],
        queryFn: async () => {
            const response = await apiHelper.getResource<ApiResponse<UHFType[]>>(
                `${url}v1/uhf/`
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

  // export const useFetchWards = (lga: string) => {
  //   return useQuery({
  //     queryKey: ['wards', lga],
  //     queryFn: async (): Promise<WardType[]> => {
  //       if (!lga) return []; 
  //       const response = await apiHelper.getResource<WardType[]>(
  //         `${url}v1/wards/?lga=${lga}`
  //       );
  //       return response;
  //     },
  //     enabled: !!lga, 
  //   });
  // };    

    // export const useFetchOrgUnits = () => {
    //     return useQuery<OrgUnit[], Error>({
    //         queryKey: ['orgUnits'],
    //         queryFn: async () => {
    //         const response = await apiHelper.getResource<ApiResponse<OrgUnit[]>>(`${url}v1/org-unit-level/`);
    //         return response.data;
    //         },
    //     });
    // };


    export const useUpsertUHF = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, data }: { id?: number; data: Partial<UHFType> | Omit<UHFType, 'id'> }) =>
          id
            ? apiHelper.putResource<UHFType>(`${url}v1/uhf/${id}/`, data)
            : apiHelper.postResource<UHFType>(`${url}v1/uhf/`, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['uhf'] });
        },
      });
    };

    export const useDeleteUHF = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (id: number) => 
          apiHelper.deleteResource<void>(`${url}v1/uhf/${id}/`),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['uhf'] });
        },
      });
    };

   export const useFetchHFAList = (state: string, lga?: string, status?: string) => {
    return useQuery({
      queryKey: ['hfa-list', state, lga, status],
      queryFn: async (): Promise<HFAType[]> => {
        if (!state) return [];

        try {
          let apiUrl = `${url}v1/ehf-detail-routes/?state=${encodeURIComponent(state.trim())}`;

          if (status && status.trim()) {
            apiUrl += `&status=${encodeURIComponent(status.trim())}`;
          }

          if (lga && lga.trim()) {
            apiUrl += `&lga=${encodeURIComponent(lga.trim())}`;
          }

          const response = await apiHelper.getResource<any[]>(apiUrl);

          return Array.isArray(response) ? response : [];
        } catch (error) {
          console.error('API Error - HFA List:', error);
          return [];
        }
      },
      enabled: !!state,
    });
  };


//   export const useFetchHFAListByState = (state: string) => {
//   return useQuery({
//     queryKey: ['hfa-list-by-state', state],
//     queryFn: async (): Promise<HFAType[]> => {
//       if (!state) return [];

//       try {
//         const response = await apiHelper.getResource<ApiResponse<HFAType[]>>(
//           `${url}v1/hfa-list/?state=${encodeURIComponent(state.trim())}`
//         );

//         return Array.isArray(response.data) ? response.data : [];
//       } catch (error) {
//         console.error('API Error - HFA List by State:', error);
//         return [];
//       }
//     },
//     enabled: !!state,
//   });
// };