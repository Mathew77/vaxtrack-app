import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { LgaType, StateType, EHFType, WardType, OrgUnit, VaccineStorageType  } from "./ehf-type";

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

    // export const useFetchOrgUnits = () => {
    //     return useQuery<OrgUnit[], Error>({
    //         queryKey: ['orgUnits'],
    //         queryFn: async () => {
    //         const response = await apiHelper.getResource<ApiResponse<OrgUnit[]>>(`${url}v1/org-unit-level/`);
    //         return response.data;
    //         },
    //     });
    // };


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


  // http://127.0.0.1:8000/api/v1/pqs-equipment/

  export const useVaccineStorage = () => {
    return useQuery({
      queryKey: ['vaccine-storage'],
      queryFn: async (): Promise<VaccineStorageType[]> => {
        const response = await apiHelper.getResource<ApiResponse<VaccineStorageType[]>>(
            `${url}v1/pqs-equipment/`
        );
        return response.data;
      },
    });
  };

  // New endpoint for EHF setup - uses ehf-detail-routes with state/lga filter
  export const useFetchEHFDetailRoutes = (state: string, lga?: string) => {
    return useQuery({
      queryKey: ['ehf-detail-routes', state, lga],
      queryFn: async (): Promise<any[]> => {
        if (!state) return [];

        try {
          let apiUrl = `${url}v1/ehf-detail-routes/?state=${encodeURIComponent(state.trim())}`;

          if (lga && lga.trim()) {
            apiUrl += `&lga=${encodeURIComponent(lga.trim())}`;
          }

          const response = await apiHelper.getResource<any>(apiUrl);

          if (Array.isArray(response)) return response;
          if (response && Array.isArray(response.results)) return response.results;
          return [];
        } catch (error) {
          console.error('API Error - EHF Detail Routes:', error);
          return [];
        }
      },
      enabled: !!state,
    });
  };

  // Fetch EHFs by a list of assigned_unique_ids - used by Conveyor role
  export const useFetchEHFsByIds = (ids: string[]) => {
    return useQuery({
      queryKey: ['ehf-detail-routes-by-ids', ids],
      queryFn: async (): Promise<any[]> => {
        if (!ids || ids.length === 0) return [];
        try {
          const results = await Promise.all(
            ids.map((id) =>
              apiHelper.getResource<any[]>(
                `${url}v1/ehf-detail-routes/?assigned_unique_id=${encodeURIComponent(id)}`
              ).catch(() => [])
            )
          );
          const flat = results.flat();
          return Array.isArray(flat) ? flat : [];
        } catch (error) {
          console.error('API Error - EHF by IDs:', error);
          return [];
        }
      },
      enabled: ids.length > 0,
      staleTime: 10 * 60 * 1000, // 10 minutes — EHF state doesn't change mid-session
    });
  };

  // Fetch all EHF list for display - uses ehf-detail-routes
  export const useFetchEHFList = () => {
    return useQuery({
      queryKey: ['ehf-list-all'],
      queryFn: async (): Promise<any[]> => {
        try {
          const response = await apiHelper.getResource<any>(
            `${url}v1/ehf-detail-routes/`
          );

          if (Array.isArray(response)) return response;
          if (response && Array.isArray(response.results)) return response.results;
          return [];
        } catch (error) {
          console.error('API Error - EHF List:', error);
          return [];
        }
      },
    });
  };
