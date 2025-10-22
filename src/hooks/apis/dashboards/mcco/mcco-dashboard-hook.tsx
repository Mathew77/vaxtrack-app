import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { MccoDashboardType, MccoIndicatorsResponse, MccoVaccineSummary, MccoFacilityType, MccoEHFType } from "./mcco-dashboard-type";


export const useFetchMccoIndicators = () => {
    return useQuery<MccoIndicatorsResponse, Error>({
        queryKey: ['mcco-indicators'],
        queryFn: async () => {
            try {
                // Get the assigned EHF list from sessionStorage for this MCCO user
                const ehfListString = sessionStorage.getItem('ehf_list');
                let assignedEhfIds: string[] = [];

                if (ehfListString) {
                    try {
                        assignedEhfIds = JSON.parse(ehfListString);
                    } catch (error) {
                        console.error('Error parsing ehf_list from sessionStorage:', error);
                    }
                }

                // Build query string with comma-separated assigned_unique_ids
                const queryParams = assignedEhfIds.length > 0
                    ? `assigned_unique_ids=${assignedEhfIds.join(',')}`
                    : '';

                // Fetch indicators data filtered by assigned_unique_ids
                const apiUrl = queryParams
                    ? `${url}v1/mcco3pl-slwg-indicators/?${queryParams}`
                    : `${url}v1/mcco3pl-slwg-indicators/`;

                const response = await apiHelper.getResource<MccoIndicatorsResponse>(apiUrl);
                return response;
            } catch (error) {
                console.error('MCCO Indicators fetch error:', error);
                throw error;
            }
        },
    });
};

const transformRowsToEHFs = (rows: any[]): MccoDashboardType => {
  const ehfMap: Record<string, MccoEHFType> = {};

  rows.forEach((row, index) => {
    const ehfKey = row.assigned_unique_id || `ehf-${index}`;

    // Initialize EHF if not exists
    if (!ehfMap[ehfKey]) {
      const emptySummary: MccoVaccineSummary = {
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
    const facility: MccoFacilityType = {
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

export const useFetchMccoDashboard = () => {
  return useQuery<MccoDashboardType, Error>({
    queryKey: ["mcco-dashboard"],
    queryFn: async () => {
      try {
        // Get the assigned EHF list from sessionStorage for this MCCO user
        const ehfListString = sessionStorage.getItem('ehf_list');
        let assignedEhfIds: string[] = [];

        if (ehfListString) {
          try {
            assignedEhfIds = JSON.parse(ehfListString);
          } catch (error) {
            console.error('Error parsing ehf_list from sessionStorage:', error);
          }
        }

        // Build query string with comma-separated assigned_unique_ids
        const queryParams = assignedEhfIds.length > 0
          ? `assigned_unique_ids=${assignedEhfIds.join(',')}`
          : '';

        // Fetch dashboard data filtered by assigned_unique_ids
        const apiUrl = queryParams
          ? `${url}v1/mcco3pl-slwg-table/?${queryParams}`
          : `${url}v1/mcco3pl-slwg-table/`;

        const response = await apiHelper.getResource<{ rows: any[] }>(apiUrl);

        return transformRowsToEHFs(response.rows || []);
      } catch (error) {
        console.error('MCCO Dashboard fetch error:', error);
        throw error;
      }
    },
  });
};
