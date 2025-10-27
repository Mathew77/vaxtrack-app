import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { FacilityType, SlwgDashboardType, SlwgDashboardWardType, SlwgIndicatorsResponse, WardVaccineSummary } from "./slwg-dashboard-type";
import { useFetchScs } from "../../lcs-scs/scs-hooks";


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
// export const useFetchSlwgSummary = () => {
//     const scs_id = getScsId();

//     return useQuery<SlwgSummaryType, Error>({
//         queryKey: ['slwg-summary', scs_id],
//         queryFn: async () => {
//             const response = await apiHelper.getResource<SlwgSummaryType>(
//                 `${url}v1/slwg-summary/?scs_id=${scs_id}`
//             );
//             return response;
//         },
//         enabled: !!scs_id,
//     });
// };

export const useFetchSlwgIndicators = () => {
    const scs_id = getScsId();
    const { data: allScs } = useFetchScs();

    return useQuery<SlwgIndicatorsResponse, Error>({
        queryKey: ['slwg-indicators', scs_id],
        queryFn: async () => {
            // Get the state associated with this SCS
            const scsFacility = allScs?.find(scs => scs.id?.toString() === scs_id?.toString());

            const stateName = scsFacility?.stat_id;


            if (!stateName) {
                throw new Error('Could not determine state for SLWG user');
            }

            const response = await apiHelper.getResource<SlwgIndicatorsResponse>(
                `${url}v1/dashboard-slwg-indicators/?state=${stateName}`
            );
            return response;
        },
        enabled: !!scs_id && !!allScs,
    });
};


const transformRowsToWards = (rows: any[]): SlwgDashboardType => {
  const wardMap: Record<string, SlwgDashboardWardType> = {};

  rows.forEach((row, index) => {
    const key = `${row.state}-${row.lga}-${row.ward}`;

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
        lga: row.lga,
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

export const useFetchSlwgDashboard = () => {
  const scs_id = getScsId();
  const { data: allScs } = useFetchScs();

  return useQuery<SlwgDashboardType, Error>({
    queryKey: ["slwg-dashboard-ward", scs_id],
    queryFn: async () => {
      // Get the state associated with this SCS
      const scsFacility = allScs?.find(scs => scs.id?.toString() === scs_id?.toString());

      const stateName = scsFacility?.stat_id;


      if (!stateName) {
        throw new Error('Could not determine state for SLWG user');
      }

      // New API returns { filters, rows } and accepts state parameter
      const response = await apiHelper.getResource<{ rows: any[] }>(
        `${url}v1/dashboard-slwg-table/?state=${stateName}`
      );


      return transformRowsToWards(response.rows);
    },
    enabled: !!scs_id && !!allScs,
  });
};



// Hook for SLWG Dashboard (Ward-level data)
// export const useFetchSlwgDashboard = () => {
//     const scs_id = getScsId();

//     return useQuery<SlwgDashboardType, Error>({
//         queryKey: ['slwg-dashboard-ward', scs_id],
//         queryFn: async () => {
//             const response = await apiHelper.getResource<SlwgDashboardType>(
//                 `${url}v1/dashboard-slwg-table/`
//             );
//             return response;
//         },
//         enabled: !!scs_id,
//     });
// }
