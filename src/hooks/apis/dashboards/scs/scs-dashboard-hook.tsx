import {  useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { ScsDashboardType } from "./scs-dashboard-type";



export const useFetchScsDashboard = () => {
    const ScsListString = sessionStorage.getItem('scs_list');
    let scs_id = null;

    if (ScsListString) {
        try {
            const ScsList = JSON.parse(ScsListString);
            
            if (Array.isArray(ScsList) && ScsList.length > 0) {
                scs_id = parseInt(ScsList[0], 10);
            }
        } catch (error) {
            console.error('Error parsing scs_list from sessionStorage:', error);
        }
    }
  
    return useQuery<ScsDashboardType, Error>({
        queryKey: ['scs-summary', scs_id],
        queryFn: async () => {
            const response = await apiHelper.getResource<ScsDashboardType>(
                `${url}v1/scs-summary/?scs_id=${scs_id}`
            );
            return response;
        },
    });
}
