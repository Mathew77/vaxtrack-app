import {  useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { UHFDashboardType } from "./uhf-dashboard-type";



export const useFetchUhfDashboard = () => {
    const uhfListString = sessionStorage.getItem('uhf_list');
    let uhf_id = null;

    if (uhfListString) {
        try {
        const uhfList = JSON.parse(uhfListString);
        uhf_id = Array.isArray(uhfList) && uhfList.length > 0 ? parseInt(uhfList[0], 10) : null;
        } catch (error) {
        console.error('Error parsing uhf_list from sessionStorage:', error);
        }
    }  
  return useQuery<UHFDashboardType, Error>({
    queryKey: ['session-summary', uhf_id],
    queryFn: async () => {
      const response = await apiHelper.getResource<UHFDashboardType>(
        `${url}v1/session-summary/?uhf_id=${uhf_id}`
      );
      return response;
    },
  });
}


