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
        if (!state || state === 'all-states') return [];
        const response = await apiHelper.getResource<LgaType[]>(
          `${url}v1/lgas/?state=${state}`
        );
        return response;
      },
      enabled: !!state && state !== 'all-states',
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

export const useFetchStockOutReport = (state?: string, lga?: string, ward?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['stock-out-report', state, lga, ward],
    queryFn: async (): Promise<any> => {
      let endpoint = `${url}v1/reports/stock-out/`;
      const params = new URLSearchParams();

      if (state && state !== 'all-states') {
        params.append('state', state);
      }
      if (lga) {
        params.append('lga', lga);
      }
      if (ward) {
        params.append('ward', ward);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await apiHelper.getResource<any>(fullUrl);
      return response;
    },
    enabled: enabled && !!state,
  });
};

export const useFetchColdChainStatusReport = (state?: string, lga?: string, ward?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['cold-chain-status-report', state, lga, ward],
    queryFn: async (): Promise<any> => {
      let endpoint = `${url}v1/reports/cold-chain-status/`;
      const params = new URLSearchParams();

      if (state && state !== 'all-states') {
        params.append('state', state);
      }
      if (lga) {
        params.append('lga', lga);
      }
      if (ward) {
        params.append('ward', ward);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await apiHelper.getResource<any>(fullUrl);
      return response;
    },
    enabled: enabled && !!state,
  });
};

export const useFetchMinimumStockFlagReport = (state?: string, lga?: string, ward?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['minimum-stock-flag-report', state, lga, ward],
    queryFn: async (): Promise<any> => {
      let endpoint = `${url}v1/reports/minimum-stock-flag/`;
      const params = new URLSearchParams();

      if (state && state !== 'all-states') {
        params.append('state', state);
      }
      if (lga) {
        params.append('lga', lga);
      }
      if (ward) {
        params.append('ward', ward);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await apiHelper.getResource<any>(fullUrl);
      return response;
    },
    enabled: enabled && !!state,
  });
};

export const useFetchVvmStageReport = (state?: string, lga?: string, ward?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['vvm-stage-report', state, lga, ward],
    queryFn: async (): Promise<any> => {
      let endpoint = `${url}v1/reports/vvm-stage/`;
      const params = new URLSearchParams();

      if (state && state !== 'all-states') {
        params.append('state', state);
      }
      if (lga) {
        params.append('lga', lga);
      }
      if (ward) {
        params.append('ward', ward);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await apiHelper.getResource<any>(fullUrl);
      return response;
    },
    enabled: enabled && !!state,
  });
};

export const useFetchMaximumStockReport = (state?: string, lga?: string, ward?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['maximum-stock-report', state, lga, ward],
    queryFn: async (): Promise<any> => {
      let endpoint = `${url}v1/reports/maximum-stock/`;
      const params = new URLSearchParams();

      if (state && state !== 'all-states') {
        params.append('state', state);
      }
      if (lga) {
        params.append('lga', lga);
      }
      if (ward) {
        params.append('ward', ward);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await apiHelper.getResource<any>(fullUrl);
      return response;
    },
    enabled: enabled && !!state,
  });
};

export const useFetchPeriodReport = (
  endpoint: string,
  queryKey: string,
  state?: string,
  period_from?: string,
  period_to?: string,
  lga?: string,
  ward?: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [queryKey, state, period_from, period_to, lga, ward],
    queryFn: async (): Promise<any> => {
      const params = new URLSearchParams();
      if (state && state !== 'all-states') params.append('state', state);
      if (period_from) params.append('period_from', period_from);
      if (period_to) params.append('period_to', period_to);
      if (lga) params.append('lga', lga);
      if (ward) params.append('ward', ward);
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}${endpoint}?${queryString}` : `${url}${endpoint}`;
      return await apiHelper.getResource<any>(fullUrl);
    },
    enabled: enabled && !!state,
  });
};