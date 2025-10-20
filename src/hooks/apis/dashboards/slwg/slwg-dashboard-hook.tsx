import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { SlwgDashboardType, SlwgSummaryType } from "./slwg-dashboard-type";


const getScsId = () => {
    const scsListString = sessionStorage.getItem('scs_list');
    let scs_id = null;

    if (scsListString) {
        try {
            const scsList = JSON.parse(scsListString);
            if (Array.isArray(scsList) && scsList.length > 0) {
                scs_id = parseInt(scsList[0], 10);
            }
        } catch (error) {
            console.error('Error parsing scs_list from sessionStorage:', error);
        }
    }
    return scs_id;
};

// Hook for SLWG Summary/Statistics
export const useFetchSlwgSummary = () => {
    const scs_id = getScsId();

    return useQuery<SlwgSummaryType, Error>({
        queryKey: ['slwg-summary', scs_id],
        queryFn: async () => {
            const response = await apiHelper.getResource<SlwgSummaryType>(
                `${url}v1/slwg-summary/?scs_id=${scs_id}`
            );
            return response;
        },
        enabled: !!scs_id,
    });
};

// Hook for SLWG Dashboard (Ward-level data)
export const useFetchSlwgDashboard = () => {
    const scs_id = getScsId();

    return useQuery<SlwgDashboardType, Error>({
        queryKey: ['slwg-dashboard-ward', scs_id],
        queryFn: async () => {
            const response = await apiHelper.getResource<SlwgDashboardType>(
                `${url}v1/dashboard-slwg-by-ward/`
            );
            return response;
        },
        enabled: !!scs_id,
    });
}
