import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { ScsDashboardType, ScsIndicatorsResponse, ScsWardVaccineSummary, ScsFacilityType, ScsDashboardLgaType, ScsWardType } from "./scs-dashboard-type";

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

export const useFetchScsIndicators = () => {
    const scs_id = getScsId();

    return useQuery<ScsIndicatorsResponse, Error>({
        queryKey: ['scs-indicators', scs_id],
        queryFn: async () => {
            const response = await apiHelper.getResource<ScsIndicatorsResponse>(
                `${url}v1/dashboard-slwg-indicators/?scs_id=${scs_id}`
            );
            return response;
        },
        enabled: !!scs_id,
    });
};

const transformRowsToLgas = (rows: any[]): ScsDashboardType => {
  const lgaMap: Record<string, ScsDashboardLgaType> = {};

  rows.forEach((row, index) => {
    const lgaKey = `${row.state}-${row.lga}`;
    const wardKey = `${row.state}-${row.lga}-${row.ward}`;

    // Initialize LGA if not exists
    if (!lgaMap[lgaKey]) {
      const emptySummary: ScsWardVaccineSummary = {
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

      lgaMap[lgaKey] = {
        state: row.state,
        lga: row.lga,
        sum_of_vaccine_at_lga_level: emptySummary,
        wards: [],
      };
    }

    // Find or create ward
    let ward = lgaMap[lgaKey].wards.find(w => w.ward === row.ward);
    if (!ward) {
      const emptySummary: ScsWardVaccineSummary = {
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

      ward = {
        state: row.state,
        lga: row.lga,
        ward: row.ward,
        sum_of_vaccine_at_ward_level: emptySummary,
        facilities: [],
      };
      lgaMap[lgaKey].wards.push(ward);
    }

    // Create facility object
    const facility: ScsFacilityType = {
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

    ward.facilities.push(facility);

    // Accumulate sums at ward level
    const wardSum = ward.sum_of_vaccine_at_ward_level;
    wardSum.dose_bcg += row.dose_bcg || 0;
    wardSum.dose_hepb += row.dose_hepb || 0;
    wardSum.dose_bopv += row.dose_bopv || 0;
    wardSum.dose_penta += row.dose_penta || 0;
    wardSum.dose_pcv += row.dose_pcv || 0;
    wardSum.dose_ipv += row.dose_ipv || 0;
    wardSum.dose_mea += row.dose_mea || 0;
    wardSum.dose_yf += row.dose_yf || 0;
    wardSum.dose_td += row.dose_td || 0;
    wardSum.dose_mena += row.dose_mena || 0;
    wardSum.dose_rota += row.dose_rota || 0;
    wardSum.dose_hpv += row.dose_hpv || 0;

    wardSum.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    wardSum.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    wardSum.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    wardSum.dose_penta_allocated += row.dose_penta_allocated || 0;
    wardSum.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    wardSum.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    wardSum.dose_mea_allocated += row.dose_mea_allocated || 0;
    wardSum.dose_yf_allocated += row.dose_yf_allocated || 0;
    wardSum.dose_td_allocated += row.dose_td_allocated || 0;
    wardSum.dose_mena_allocated += row.dose_mena_allocated || 0;
    wardSum.dose_rota_allocated += row.dose_rota_allocated || 0;
    wardSum.dose_hpv_allocated += row.dose_hpv_allocated || 0;

    // Accumulate sums at LGA level
    const lgaSum = lgaMap[lgaKey].sum_of_vaccine_at_lga_level;
    lgaSum.dose_bcg += row.dose_bcg || 0;
    lgaSum.dose_hepb += row.dose_hepb || 0;
    lgaSum.dose_bopv += row.dose_bopv || 0;
    lgaSum.dose_penta += row.dose_penta || 0;
    lgaSum.dose_pcv += row.dose_pcv || 0;
    lgaSum.dose_ipv += row.dose_ipv || 0;
    lgaSum.dose_mea += row.dose_mea || 0;
    lgaSum.dose_yf += row.dose_yf || 0;
    lgaSum.dose_td += row.dose_td || 0;
    lgaSum.dose_mena += row.dose_mena || 0;
    lgaSum.dose_rota += row.dose_rota || 0;
    lgaSum.dose_hpv += row.dose_hpv || 0;

    lgaSum.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    lgaSum.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    lgaSum.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    lgaSum.dose_penta_allocated += row.dose_penta_allocated || 0;
    lgaSum.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    lgaSum.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    lgaSum.dose_mea_allocated += row.dose_mea_allocated || 0;
    lgaSum.dose_yf_allocated += row.dose_yf_allocated || 0;
    lgaSum.dose_td_allocated += row.dose_td_allocated || 0;
    lgaSum.dose_mena_allocated += row.dose_mena_allocated || 0;
    lgaSum.dose_rota_allocated += row.dose_rota_allocated || 0;
    lgaSum.dose_hpv_allocated += row.dose_hpv_allocated || 0;
  });

  return Object.values(lgaMap);
};

export const useFetchScsDashboard = () => {
  const scs_id = getScsId();

  return useQuery<ScsDashboardType, Error>({
    queryKey: ["scs-dashboard-lga", scs_id],
    queryFn: async () => {
      const response = await apiHelper.getResource<{ rows: any[] }>(
        `${url}v1/dashboard-slwg-table/`
      );
      return transformRowsToLgas(response.rows);
    },
    enabled: !!scs_id,
  });
};
