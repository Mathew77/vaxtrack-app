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

const emptyVaccineSummary = (): AdminWardVaccineSummary => ({
  dose_bcg: 0, dose_hepb: 0, dose_bopv: 0, dose_penta: 0, dose_pcv: 0,
  dose_ipv: 0, dose_mea: 0, dose_yf: 0, dose_td: 0, dose_mena: 0,
  dose_rota: 0, dose_hpv: 0, mr: 0,
  dose_bcg_allocated: 0, dose_hepb_allocated: 0, dose_bopv_allocated: 0,
  dose_penta_allocated: 0, dose_pcv_allocated: 0, dose_ipv_allocated: 0,
  dose_mea_allocated: 0, dose_yf_allocated: 0, dose_td_allocated: 0,
  dose_mena_allocated: 0, dose_rota_allocated: 0, dose_hpv_allocated: 0, dose_mr_allocated: 0,
  dose_bcg_actual: 0, dose_hepb_actual: 0, dose_bopv_actual: 0,
  dose_penta_actual: 0, dose_pcv_actual: 0, dose_ipv_actual: 0,
  dose_mea_actual: 0, dose_yf_actual: 0, dose_td_actual: 0,
  dose_mena_actual: 0, dose_rota_actual: 0, dose_hpv_actual: 0, dose_mr_actual: 0,
  dose_bcg_received: 0, dose_hepb_received: 0, dose_bopv_received: 0,
  dose_penta_received: 0, dose_pcv_received: 0, dose_ipv_received: 0,
  dose_mea_received: 0, dose_yf_received: 0, dose_td_received: 0,
  dose_mena_received: 0, dose_rota_received: 0, dose_hpv_received: 0, dose_mr_received: 0,
  bcg_physical_stock_balance: 0, hepb_physical_stock_balance: 0,
  bopv_physical_stock_balance: 0, penta_physical_stock_balance: 0,
  pcv_physical_stock_balance: 0, ipv_physical_stock_balance: 0,
  mea_physical_stock_balance: 0, yf_physical_stock_balance: 0,
  td_physical_stock_balance: 0, mena_physical_stock_balance: 0,
  rota_physical_stock_balance: 0, hpv_physical_stock_balance: 0, mr_physical_stock_balance: 0,
});

const transformRowsToStates = (rows: any[]): AdminDashboardType => {
  const stateMap: Record<string, AdminDashboardStateType> = {};

  rows.forEach((row, index) => {
    const stateKey = row.state;

    // Initialize state if doesn't exist
    if (!stateMap[stateKey]) {
      stateMap[stateKey] = {
        state: row.state,
        sum_of_vaccine_at_state_level: emptyVaccineSummary(),
        lgas: [],
      };
    }

    // Find or create LGA
    let lga = stateMap[stateKey].lgas.find(l => l.lga === row.lga);
    if (!lga) {
      lga = {
        state: row.state,
        lga: row.lga,
        sum_of_vaccine_at_lga_level: emptyVaccineSummary(),
        wards: [],
      };
      stateMap[stateKey].lgas.push(lga);
    }

    // Find or create Ward
    let ward = lga.wards.find(w => w.ward === row.ward);
    if (!ward) {
      ward = {
        state: row.state,
        lga: row.lga,
        ward: row.ward,
        sum_of_vaccine_at_ward_level: emptyVaccineSummary(),
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
      mr: row.mr ?? null,
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
      dose_mr_allocated: row.dose_mr_allocated ?? null,
      dose_bcg_actual: row.dose_bcg_actual ?? null,
      dose_hepb_actual: row.dose_hepb_actual ?? null,
      dose_bopv_actual: row.dose_bopv_actual ?? null,
      dose_penta_actual: row.dose_penta_actual ?? null,
      dose_pcv_actual: row.dose_pcv_actual ?? null,
      dose_ipv_actual: row.dose_ipv_actual ?? null,
      dose_mea_actual: row.dose_mea_actual ?? null,
      dose_yf_actual: row.dose_yf_actual ?? null,
      dose_td_actual: row.dose_td_actual ?? null,
      dose_mena_actual: row.dose_mena_actual ?? null,
      dose_rota_actual: row.dose_rota_actual ?? null,
      dose_hpv_actual: row.dose_hpv_actual ?? null,
      dose_mr_actual: row.dose_mr_actual ?? null,
      dose_bcg_received: row.dose_bcg_received ?? null,
      dose_hepb_received: row.dose_hepb_received ?? null,
      dose_bopv_received: row.dose_bopv_received ?? null,
      dose_penta_received: row.dose_penta_received ?? null,
      dose_pcv_received: row.dose_pcv_received ?? null,
      dose_ipv_received: row.dose_ipv_received ?? null,
      dose_mea_received: row.dose_mea_received ?? null,
      dose_yf_received: row.dose_yf_received ?? null,
      dose_td_received: row.dose_td_received ?? null,
      dose_mena_received: row.dose_mena_received ?? null,
      dose_rota_received: row.dose_rota_received ?? null,
      dose_hpv_received: row.dose_hpv_received ?? null,
      dose_mr_received: row.dose_mr_received ?? null,
      bcg_physical_stock_balance: row.bcg_physical_stock_balance ?? null,
      hepb_physical_stock_balance: row.hepb_physical_stock_balance ?? null,
      bopv_physical_stock_balance: row.bopv_physical_stock_balance ?? null,
      penta_physical_stock_balance: row.penta_physical_stock_balance ?? null,
      pcv_physical_stock_balance: row.pcv_physical_stock_balance ?? null,
      ipv_physical_stock_balance: row.ipv_physical_stock_balance ?? null,
      mea_physical_stock_balance: row.mea_physical_stock_balance ?? null,
      yf_physical_stock_balance: row.yf_physical_stock_balance ?? null,
      td_physical_stock_balance: row.td_physical_stock_balance ?? null,
      mena_physical_stock_balance: row.mena_physical_stock_balance ?? null,
      rota_physical_stock_balance: row.rota_physical_stock_balance ?? null,
      hpv_physical_stock_balance: row.hpv_physical_stock_balance ?? null,
      mr_physical_stock_balance: row.mr_physical_stock_balance ?? null,
    };

    ward.facilities.push(facility);

    const vaccines = ['bcg', 'hepb', 'bopv', 'penta', 'pcv', 'ipv', 'mea', 'yf', 'td', 'mena', 'rota', 'hpv'];
    vaccines.forEach(v => {
      const received = row[`dose_${v}_received`] || 0;
      const actual = row[`dose_${v}_actual`] || 0;
      const physical = row[`${v}_physical_stock_balance`] || 0;
      const allocated = row[`dose_${v}_allocated`] || 0;
      const base = row[`dose_${v}`] || 0;

      (ward!.sum_of_vaccine_at_ward_level as any)[`dose_${v}`] += base;
      (ward!.sum_of_vaccine_at_ward_level as any)[`dose_${v}_allocated`] += allocated;
      (ward!.sum_of_vaccine_at_ward_level as any)[`dose_${v}_actual`] += actual;
      (ward!.sum_of_vaccine_at_ward_level as any)[`dose_${v}_received`] += received;
      (ward!.sum_of_vaccine_at_ward_level as any)[`${v}_physical_stock_balance`] += physical;

      (lga!.sum_of_vaccine_at_lga_level as any)[`dose_${v}`] += base;
      (lga!.sum_of_vaccine_at_lga_level as any)[`dose_${v}_allocated`] += allocated;
      (lga!.sum_of_vaccine_at_lga_level as any)[`dose_${v}_actual`] += actual;
      (lga!.sum_of_vaccine_at_lga_level as any)[`dose_${v}_received`] += received;
      (lga!.sum_of_vaccine_at_lga_level as any)[`${v}_physical_stock_balance`] += physical;

      (stateMap[stateKey].sum_of_vaccine_at_state_level as any)[`dose_${v}`] += base;
      (stateMap[stateKey].sum_of_vaccine_at_state_level as any)[`dose_${v}_allocated`] += allocated;
      (stateMap[stateKey].sum_of_vaccine_at_state_level as any)[`dose_${v}_actual`] += actual;
      (stateMap[stateKey].sum_of_vaccine_at_state_level as any)[`dose_${v}_received`] += received;
      (stateMap[stateKey].sum_of_vaccine_at_state_level as any)[`${v}_physical_stock_balance`] += physical;
    });
    // MR uses different field naming convention
    const mrBase = row.mr || 0;
    const mrAllocated = row.dose_mr_allocated || 0;
    const mrActual = row.dose_mr_actual || 0;
    const mrReceived = row.dose_mr_received || 0;
    const mrPhysical = row.mr_physical_stock_balance || 0;
    (ward!.sum_of_vaccine_at_ward_level as any).mr += mrBase;
    (ward!.sum_of_vaccine_at_ward_level as any).dose_mr_allocated += mrAllocated;
    (ward!.sum_of_vaccine_at_ward_level as any).dose_mr_actual += mrActual;
    (ward!.sum_of_vaccine_at_ward_level as any).dose_mr_received += mrReceived;
    (ward!.sum_of_vaccine_at_ward_level as any).mr_physical_stock_balance += mrPhysical;
    (lga!.sum_of_vaccine_at_lga_level as any).mr += mrBase;
    (lga!.sum_of_vaccine_at_lga_level as any).dose_mr_allocated += mrAllocated;
    (lga!.sum_of_vaccine_at_lga_level as any).dose_mr_actual += mrActual;
    (lga!.sum_of_vaccine_at_lga_level as any).dose_mr_received += mrReceived;
    (lga!.sum_of_vaccine_at_lga_level as any).mr_physical_stock_balance += mrPhysical;
    (stateMap[stateKey].sum_of_vaccine_at_state_level as any).mr += mrBase;
    (stateMap[stateKey].sum_of_vaccine_at_state_level as any).dose_mr_allocated += mrAllocated;
    (stateMap[stateKey].sum_of_vaccine_at_state_level as any).dose_mr_actual += mrActual;
    (stateMap[stateKey].sum_of_vaccine_at_state_level as any).dose_mr_received += mrReceived;
    (stateMap[stateKey].sum_of_vaccine_at_state_level as any).mr_physical_stock_balance += mrPhysical;
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
