import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { AdminAntigenStock, AdminLogisticStock, MonthlyAntigenStock } from "./admin-dashboard-type";


  export const useFetchAdminLogisticsStockSummary = (state?: string, lga?: string) => {
      return useQuery<AdminLogisticStock, Error>({
          queryKey: ['logistic-stock-summary', state, lga],
          queryFn: async () => {
              let apiUrl = `${url}v1/logistic-stock-summary/`;
              const params = new URLSearchParams();
              if (state) params.append('state', state);
              if (lga) params.append('lga', lga);
              if (params.toString()) apiUrl += `?${params.toString()}`;

              const response = await apiHelper.getResource<AdminLogisticStock>(apiUrl);
              return response
          }
      })
  }

    export const useFetchAntigenStockSummary = () => {
        return useQuery<AdminAntigenStock, Error>({
            queryKey: ["antigen-stock-summary"],
            queryFn: async () => {
            const response = await apiHelper.getResource<AdminAntigenStock>(
                `${url}v1/antigen-stock-summary/`
            );
            return response;
            },
        });
    };

    export const useFetchAntigenMonthlyStock = (state?: string, lga?: string) => {
        return useQuery<MonthlyAntigenStock[], Error>({
            queryKey: ["antigen-monthly-stock", state, lga],
            queryFn: async () => {
            let apiUrl = `${url}v1/antigen-monthly-both-flags/`;
            const params = new URLSearchParams();
            if (state) params.append('state', state);
            if (lga) params.append('lga', lga);
            if (params.toString()) apiUrl += `?${params.toString()}`;

            const response = await apiHelper.getResource<MonthlyAntigenStock[]>(apiUrl);
            return response;
            },
        });
    };

 



  
