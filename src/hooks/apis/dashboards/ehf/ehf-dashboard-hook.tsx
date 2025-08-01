import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { EhfAntigenStock, EhfForwardReverseLogistic } from "./ehf-dashboard-type";



export const useFetchAntigenEhfStock = () => {
  const ehfListString = sessionStorage.getItem('ehf_list');
  let ehf_id = null;

  if (ehfListString) {
    try {
      const ehfList = JSON.parse(ehfListString);
      ehf_id = Array.isArray(ehfList) && ehfList.length > 0 ? parseInt(ehfList[0], 10) : null;
    } catch (error) {
      console.error('Error parsing ehf_list from sessionStorage:', error);
    }
  }
  
  return useQuery<EhfAntigenStock, Error>({
    queryKey: ['antigen-monthly-stock', ehf_id],
    queryFn: async () => {
      const response = await apiHelper.getResource<EhfAntigenStock>(
        `${url}v1/product-stock-summary/?ehf_id=${ehf_id}`
      );
      return response;
    },
    enabled: ehf_id !== null && !isNaN(ehf_id),
  });
};



export const useFetchForwardReverseLogisticsEhf = () => {
    const ehfListString = sessionStorage.getItem('ehf_list');
    let ehf_id = null;

    if (ehfListString) {
        try {
        const ehfList = JSON.parse(ehfListString);
        ehf_id = Array.isArray(ehfList) && ehfList.length > 0 ? parseInt(ehfList[0], 10) : null;
        } catch (error) {
        console.error('Error parsing ehf_list from sessionStorage:', error);
        }
    }

    return useQuery<EhfForwardReverseLogistic, Error>({
        queryKey: ['forward-reverse-logistics', ehf_id],
        queryFn: async () => {
            const response = await apiHelper.getResource<EhfForwardReverseLogistic>(
                `${url}v1/monthly-logistics-summary/?ehf_id=${ehf_id}`
            );
            return response;
        },
        enabled: ehf_id !== null && !isNaN(ehf_id),
    });
}