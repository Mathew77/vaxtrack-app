import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { FacilityType, LcsDashboardType, LcsDashboardWardType, LcsIndicatorsResponse, WardVaccineSummary } from "./lcs-dashboard-type";


const getLcsId = () => {
    const lcsListString = sessionStorage.getItem('lcs_list');
    let lcs_id = null;

    if (lcsListString) {
        try {
            const lcsList = JSON.parse(lcsListString);
            if (Array.isArray(lcsList) && lcsList.length > 0) {
                lcs_id = parseInt(lcsList[0], 10);
            }
        } catch (error) {
            console.error('Error parsing lcs_list from sessionStorage:', error);
        }
    }
    return lcs_id;
};

export const useFetchLcsIndicators = () => {
    const lcs_id = getLcsId();

    return useQuery<LcsIndicatorsResponse, Error>({
        queryKey: ['lcs-indicators', lcs_id],
        queryFn: async () => {
            const response = await apiHelper.getResource<LcsIndicatorsResponse>(
                `${url}v1/dashboard-slwg-indicators/?lcs_id=${lcs_id}`
            );
            return response;
        },
        enabled: !!lcs_id,
    });
};


const transformRowsToWards = (rows: any[]): LcsDashboardType => {
  const wardMap: Record<string, LcsDashboardWardType> = {};

  rows.forEach((row, index) => {
    const key = `${row.state}-${row.ward}`;

    if (!wardMap[key]) {
      // Initialize empty summary
      const emptySummary: WardVaccineSummary = {
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

      wardMap[key] = {
        state: row.state,
        ward: row.ward,
        sum_of_vaccine_at_ward_level: emptySummary,
        facilities: [],
      };
    }

    // Create facility object (only include needed fields)
    const facility: FacilityType = {
      id: index,
      name_of_ehf: row.facility_name || "Unknown Facility",
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

    wardMap[key].facilities.push(facility);

    // Accumulate sums (use 0 for null/undefined)
    const sum = wardMap[key].sum_of_vaccine_at_ward_level;
    sum.dose_bcg += row.dose_bcg || 0;
    sum.dose_hepb += row.dose_hepb || 0;
    sum.dose_bopv += row.dose_bopv || 0;
    sum.dose_penta += row.dose_penta || 0;
    sum.dose_pcv += row.dose_pcv || 0;
    sum.dose_ipv += row.dose_ipv || 0;
    sum.dose_mea += row.dose_mea || 0;
    sum.dose_yf += row.dose_yf || 0;
    sum.dose_td += row.dose_td || 0;
    sum.dose_mena += row.dose_mena || 0;
    sum.dose_rota += row.dose_rota || 0;
    sum.dose_hpv += row.dose_hpv || 0;

    sum.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    sum.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    sum.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    sum.dose_penta_allocated += row.dose_penta_allocated || 0;
    sum.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    sum.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    sum.dose_mea_allocated += row.dose_mea_allocated || 0;
    sum.dose_yf_allocated += row.dose_yf_allocated || 0;
    sum.dose_td_allocated += row.dose_td_allocated || 0;
    sum.dose_mena_allocated += row.dose_mena_allocated || 0;
    sum.dose_rota_allocated += row.dose_rota_allocated || 0;
    sum.dose_hpv_allocated += row.dose_hpv_allocated || 0;
  });

  return Object.values(wardMap);
};

export const useFetchLcsDashboard = () => {
  const lcs_id = getLcsId();

  return useQuery<LcsDashboardType, Error>({
    queryKey: ["lcs-dashboard-ward", lcs_id],
    queryFn: async () => {
      const response = await apiHelper.getResource<{ rows: any[] }>(
        `${url}v1/dashboard-slwg-table/`
      );
      return transformRowsToWards(response.rows);
    },
    enabled: !!lcs_id,
  });
};
