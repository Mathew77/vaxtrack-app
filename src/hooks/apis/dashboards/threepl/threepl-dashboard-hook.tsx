import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { ThreePlDashboardType, ThreePlIndicatorsResponse, ThreePlVaccineSummary, ThreePlFacilityType, ThreePlEHFType } from "./threepl-dashboard-type";

const getThreePlId = () => {
    const threePlListString = sessionStorage.getItem('threepl_list');
    let threepl_id = null;

    if (threePlListString) {
        try {
            const threePlList = JSON.parse(threePlListString);
            if (Array.isArray(threePlList) && threePlList.length > 0) {
                threepl_id = parseInt(threePlList[0], 10);
            }
        } catch (error) {
            console.error('Error parsing threepl_list from sessionStorage:', error);
        }
    }
    return threepl_id;
};

export const useFetchThreePlIndicators = () => {
    return useQuery<ThreePlIndicatorsResponse, Error>({
        queryKey: ['threepl-indicators'],
        queryFn: async () => {
            try {
                const threeplResponse = await apiHelper.getResource<any>(
                    `${url}v1/threepl/`
                );

                // Extract all ehf_list from all 3PL organizations
                const allThreePlData = threeplResponse.data || threeplResponse;
                const allAssignedEhfIds: string[] = [];

                if (Array.isArray(allThreePlData)) {
                    allThreePlData.forEach((threepl: any) => {
                        if (threepl.ehf_list && Array.isArray(threepl.ehf_list)) {
                            allAssignedEhfIds.push(...threepl.ehf_list);
                        }
                    });
                }

                // Build query string with comma-separated assigned_unique_ids
                const queryParams = allAssignedEhfIds.length > 0
                    ? `assigned_unique_ids=${allAssignedEhfIds.join(',')}`
                    : '';

                // Fetch indicators data filtered by assigned_unique_ids
                const apiUrl = queryParams
                    ? `${url}v1/mcco3pl-slwg-indicators/?${queryParams}`
                    : `${url}v1/mcco3pl-slwg-indicators/`;

                const response = await apiHelper.getResource<ThreePlIndicatorsResponse>(apiUrl);
                return response;
            } catch (error) {
                console.error('3PL Indicators fetch error:', error);
                throw error;
            }
        },
    });
};

const transformRowsToEHFs = (rows: any[]): ThreePlDashboardType => {
  const ehfMap: Record<string, ThreePlEHFType> = {};

  rows.forEach((row, index) => {
    const ehfKey = row.assigned_unique_id || `ehf-${index}`;

    // Initialize EHF if not exists
    if (!ehfMap[ehfKey]) {
      const emptySummary: ThreePlVaccineSummary = {
        dose_bcg: 0,
        dose_hepb: 0,
        dose_bopv: 0,
        dose_penta: 0,
        dose_pcv: 0,
        dose_ipv: 0,
        dose_mea: 0,
        dose_yf: 0,
        dose_td: 0,
        dose_mena: 0,
        dose_rota: 0,
        dose_hpv: 0,
        dose_bcg_allocated: 0,
        dose_hepb_allocated: 0,
        dose_bopv_allocated: 0,
        dose_penta_allocated: 0,
        dose_pcv_allocated: 0,
        dose_ipv_allocated: 0,
        dose_mea_allocated: 0,
        dose_yf_allocated: 0,
        dose_td_allocated: 0,
        dose_mena_allocated: 0,
        dose_rota_allocated: 0,
        dose_hpv_allocated: 0,
      };

      ehfMap[ehfKey] = {
        ehf_name: row.name_of_ehf || row.facility_name || "Unknown EHF",
        assigned_unique_id: row.assigned_unique_id || "",
        sum_of_vaccine_at_ehf_level: emptySummary,
        facilities: [],
      };
    }

    // Create facility object
    const facility: ThreePlFacilityType = {
      id: index,
      name_of_ehf: row.facility_name || row.name_of_ehf || "Unknown Facility",
      assigned_unique_id: row.assigned_unique_id || "",

      // Actual doses
      dose_bcg: row.dose_bcg ?? null,
      dose_hepb: row.dose_hepb ?? null,
      dose_bopv: row.dose_bopv ?? null,
      dose_penta: row.dose_penta ?? null,
      dose_pcv: row.dose_pcv ?? null,
      dose_ipv: row.dose_ipv ?? null,
      dose_mea: row.dose_mea ?? null,
      dose_yf: row.dose_yf ?? null,
      dose_td: row.dose_td ?? null,
      dose_mena: row.dose_mena ?? null,
      dose_rota: row.dose_rota ?? null,
      dose_hpv: row.dose_hpv ?? null,

      // Allocated doses
      dose_bcg_allocated: row.dose_bcg_allocated ?? null,
      dose_hepb_allocated: row.dose_hepb_allocated ?? null,
      dose_bopv_allocated: row.dose_bopv_allocated ?? null,
      dose_penta_allocated: row.dose_penta_allocated ?? null,
      dose_pcv_allocated: row.dose_pcv_allocated ?? null,
      dose_ipv_allocated: row.dose_ipv_allocated ?? null,
      dose_mea_allocated: row.dose_mea_allocated ?? null,
      dose_yf_allocated: row.dose_yf_allocated ?? null,
      dose_td_allocated: row.dose_td_allocated ?? null,
      dose_mena_allocated: row.dose_mena_allocated ?? null,
      dose_rota_allocated: row.dose_rota_allocated ?? null,
      dose_hpv_allocated: row.dose_hpv_allocated ?? null,
    };

    ehfMap[ehfKey].facilities.push(facility);

    // Accumulate sums at EHF level
    const ehfSum = ehfMap[ehfKey].sum_of_vaccine_at_ehf_level;
    ehfSum.dose_bcg += row.dose_bcg || 0;
    ehfSum.dose_hepb += row.dose_hepb || 0;
    ehfSum.dose_bopv += row.dose_bopv || 0;
    ehfSum.dose_penta += row.dose_penta || 0;
    ehfSum.dose_pcv += row.dose_pcv || 0;
    ehfSum.dose_ipv += row.dose_ipv || 0;
    ehfSum.dose_mea += row.dose_mea || 0;
    ehfSum.dose_yf += row.dose_yf || 0;
    ehfSum.dose_td += row.dose_td || 0;
    ehfSum.dose_mena += row.dose_mena || 0;
    ehfSum.dose_rota += row.dose_rota || 0;
    ehfSum.dose_hpv += row.dose_hpv || 0;

    ehfSum.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    ehfSum.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    ehfSum.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    ehfSum.dose_penta_allocated += row.dose_penta_allocated || 0;
    ehfSum.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    ehfSum.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    ehfSum.dose_mea_allocated += row.dose_mea_allocated || 0;
    ehfSum.dose_yf_allocated += row.dose_yf_allocated || 0;
    ehfSum.dose_td_allocated += row.dose_td_allocated || 0;
    ehfSum.dose_mena_allocated += row.dose_mena_allocated || 0;
    ehfSum.dose_rota_allocated += row.dose_rota_allocated || 0;
    ehfSum.dose_hpv_allocated += row.dose_hpv_allocated || 0;
  });

  return Object.values(ehfMap);
};

export const useFetchThreePlDashboard = () => {
  return useQuery<ThreePlDashboardType, Error>({
    queryKey: ["threepl-dashboard"],
    queryFn: async () => {

      try {
        const threeplResponse = await apiHelper.getResource<any>(
          `${url}v1/threepl/`
        );

        // Extract all ehf_list from all 3PL organizations
        const allThreePlData = threeplResponse.data || threeplResponse;
        const allAssignedEhfIds: string[] = [];

        if (Array.isArray(allThreePlData)) {
          allThreePlData.forEach((threepl: any) => {
            if (threepl.ehf_list && Array.isArray(threepl.ehf_list)) {
              allAssignedEhfIds.push(...threepl.ehf_list);
            }
          });
        }


        // Build query string with comma-separated assigned_unique_ids
        const queryParams = allAssignedEhfIds.length > 0
          ? `assigned_unique_ids=${allAssignedEhfIds.join(',')}`
          : '';

        // Fetch dashboard data filtered by assigned_unique_ids
        const apiUrl = queryParams
          ? `${url}v1/mcco3pl-slwg-table/?${queryParams}`
          : `${url}v1/mcco3pl-slwg-table/`;

        const response = await apiHelper.getResource<{ rows: any[] }>(apiUrl);

        return transformRowsToEHFs(response.rows || []);
      } catch (error) {
        console.error('3PL Dashboard fetch error:', error);
        throw error;
      }
    },
  });
};
