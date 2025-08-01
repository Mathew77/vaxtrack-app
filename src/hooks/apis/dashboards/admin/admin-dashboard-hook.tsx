import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { AdminAntigenStock, AdminLogisticStock, MonthlyAntigenStock } from "./admin-dashboard-type";


  export const useFetchAdminLogisticsStockSummary = () => {
      return useQuery<AdminLogisticStock, Error>({
          queryKey: ['logistic-stock-summary'],
          queryFn: async () => {
              const response = await apiHelper.getResource<AdminLogisticStock>(
                  `${url}v1/logistic-stock-summary/`
              )
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

    export const useFetchAntigenMonthlyStock = () => {
        return useQuery<MonthlyAntigenStock[], Error>({
            queryKey: ["antigen-monthly-stock"],
            queryFn: async () => {
            const response = await apiHelper.getResource<MonthlyAntigenStock[]>(
               ` ${url}v1/antigen-monthly-both-flags/`
            );
            return response;
            },
        });
    };

 



  
