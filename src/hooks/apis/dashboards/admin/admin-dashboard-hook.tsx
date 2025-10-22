import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import {
  AdminAntigenStock,
  AdminLogisticStock,
  MonthlyAntigenStock,
  AdminIndicatorsResponse,
  AdminDashboardType,
  AdminDashboardStateType,
  AdminDashboardLgaType,
  AdminDashboardWardType,
  AdminWardVaccineSummary
} from "./admin-dashboard-type";


  export const useFetchAdminLogisticsStockSummary = (state?: string, lga?: string) => {
      return useQuery<AdminLogisticStock, Error>({
          queryKey: ['logistic-stock-summary', state, lga],
          queryFn: async () => {
              let apiUrl = `${url}v1/logistic-stock-summary/`;
              const params = new URLSearchParams();
              if (state) params.append('state', state);
              if (lga) params.append('lga', lga);
              if (params.toString()) apiUrl += `?${params.toString()}`;

              const response = await apiHelper.getResource<AdminLogisticStock>(apiUrl);
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

    export const useFetchAntigenMonthlyStock = (state?: string, lga?: string) => {
        return useQuery<MonthlyAntigenStock[], Error>({
            queryKey: ["antigen-monthly-stock", state, lga],
            queryFn: async () => {
            let apiUrl = `${url}v1/antigen-monthly-both-flags/`;
            const params = new URLSearchParams();
            if (state) params.append('state', state);
            if (lga) params.append('lga', lga);
            if (params.toString()) apiUrl += `?${params.toString()}`;

            const response = await apiHelper.getResource<MonthlyAntigenStock[]>(apiUrl);
            return response;
            },
        });
    };

// New Admin Dashboard hooks (State → LGA → Ward → Facilities)
export const useFetchAdminIndicators = () => {
  return useQuery<AdminIndicatorsResponse, Error>({
    queryKey: ['admin-indicators'],
    queryFn: async () => {
      const response = await apiHelper.getResource<AdminIndicatorsResponse>(
        `${url}v1/dashboard-slwg-indicators/`
      );
      return response;
    },
  });
};

const transformRowsToStates = (rows: any[]): AdminDashboardType => {
  const stateMap: Record<string, AdminDashboardStateType> = {};

  rows.forEach((row, index) => {
    const stateKey = row.state;
    const lgaKey = `${row.state}-${row.lga}`;
    const wardKey = `${row.state}-${row.lga}-${row.ward}`;

    // Initialize state if doesn't exist
    if (!stateMap[stateKey]) {
      const emptySummary: AdminWardVaccineSummary = {
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

      stateMap[stateKey] = {
        state: row.state,
        sum_of_vaccine_at_state_level: { ...emptySummary },
        lgas: [],
      };
    }

    // Find or create LGA
    let lga = stateMap[stateKey].lgas.find(l => l.lga === row.lga);
    if (!lga) {
      const emptySummary: AdminWardVaccineSummary = {
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

      lga = {
        state: row.state,
        lga: row.lga,
        sum_of_vaccine_at_lga_level: { ...emptySummary },
        wards: [],
      };
      stateMap[stateKey].lgas.push(lga);
    }

    // Find or create Ward
    let ward = lga.wards.find(w => w.ward === row.ward);
    if (!ward) {
      const emptySummary: AdminWardVaccineSummary = {
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
        sum_of_vaccine_at_ward_level: { ...emptySummary },
        facilities: [],
      };
      lga.wards.push(ward);
    }

    // Add facility to ward
    const facility = {
      id: index,
      name_of_ehf: row.facility_name || "Unknown Facility",
      assigned_unique_id: row.assigned_unique_id || "",
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

    // Accumulate at ward level
    ward.sum_of_vaccine_at_ward_level.dose_bcg += row.dose_bcg || 0;
    ward.sum_of_vaccine_at_ward_level.dose_hepb += row.dose_hepb || 0;
    ward.sum_of_vaccine_at_ward_level.dose_bopv += row.dose_bopv || 0;
    ward.sum_of_vaccine_at_ward_level.dose_penta += row.dose_penta || 0;
    ward.sum_of_vaccine_at_ward_level.dose_pcv += row.dose_pcv || 0;
    ward.sum_of_vaccine_at_ward_level.dose_ipv += row.dose_ipv || 0;
    ward.sum_of_vaccine_at_ward_level.dose_mea += row.dose_mea || 0;
    ward.sum_of_vaccine_at_ward_level.dose_yf += row.dose_yf || 0;
    ward.sum_of_vaccine_at_ward_level.dose_td += row.dose_td || 0;
    ward.sum_of_vaccine_at_ward_level.dose_mena += row.dose_mena || 0;
    ward.sum_of_vaccine_at_ward_level.dose_rota += row.dose_rota || 0;
    ward.sum_of_vaccine_at_ward_level.dose_hpv += row.dose_hpv || 0;
    ward.sum_of_vaccine_at_ward_level.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_penta_allocated += row.dose_penta_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_mea_allocated += row.dose_mea_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_yf_allocated += row.dose_yf_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_td_allocated += row.dose_td_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_mena_allocated += row.dose_mena_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_rota_allocated += row.dose_rota_allocated || 0;
    ward.sum_of_vaccine_at_ward_level.dose_hpv_allocated += row.dose_hpv_allocated || 0;

    // Accumulate at LGA level
    lga.sum_of_vaccine_at_lga_level.dose_bcg += row.dose_bcg || 0;
    lga.sum_of_vaccine_at_lga_level.dose_hepb += row.dose_hepb || 0;
    lga.sum_of_vaccine_at_lga_level.dose_bopv += row.dose_bopv || 0;
    lga.sum_of_vaccine_at_lga_level.dose_penta += row.dose_penta || 0;
    lga.sum_of_vaccine_at_lga_level.dose_pcv += row.dose_pcv || 0;
    lga.sum_of_vaccine_at_lga_level.dose_ipv += row.dose_ipv || 0;
    lga.sum_of_vaccine_at_lga_level.dose_mea += row.dose_mea || 0;
    lga.sum_of_vaccine_at_lga_level.dose_yf += row.dose_yf || 0;
    lga.sum_of_vaccine_at_lga_level.dose_td += row.dose_td || 0;
    lga.sum_of_vaccine_at_lga_level.dose_mena += row.dose_mena || 0;
    lga.sum_of_vaccine_at_lga_level.dose_rota += row.dose_rota || 0;
    lga.sum_of_vaccine_at_lga_level.dose_hpv += row.dose_hpv || 0;
    lga.sum_of_vaccine_at_lga_level.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_penta_allocated += row.dose_penta_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_mea_allocated += row.dose_mea_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_yf_allocated += row.dose_yf_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_td_allocated += row.dose_td_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_mena_allocated += row.dose_mena_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_rota_allocated += row.dose_rota_allocated || 0;
    lga.sum_of_vaccine_at_lga_level.dose_hpv_allocated += row.dose_hpv_allocated || 0;

    // Accumulate at State level
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_bcg += row.dose_bcg || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_hepb += row.dose_hepb || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_bopv += row.dose_bopv || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_penta += row.dose_penta || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_pcv += row.dose_pcv || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_ipv += row.dose_ipv || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_mea += row.dose_mea || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_yf += row.dose_yf || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_td += row.dose_td || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_mena += row.dose_mena || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_rota += row.dose_rota || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_hpv += row.dose_hpv || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_penta_allocated += row.dose_penta_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_mea_allocated += row.dose_mea_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_yf_allocated += row.dose_yf_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_td_allocated += row.dose_td_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_mena_allocated += row.dose_mena_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_rota_allocated += row.dose_rota_allocated || 0;
    stateMap[stateKey].sum_of_vaccine_at_state_level.dose_hpv_allocated += row.dose_hpv_allocated || 0;
  });

  return Object.values(stateMap);
};

export const useFetchAdminDashboard = () => {
  return useQuery<AdminDashboardType, Error>({
    queryKey: ["admin-dashboard-state"],
    queryFn: async () => {
      const response = await apiHelper.getResource<{ rows: any[] }>(
        `${url}v1/dashboard-slwg-table/`
      );
      return transformRowsToStates(response.rows);
    },
  });
};
