export interface LcsIndicatorsResponse {
  filters: {
    state: string | null;
    ward: string | null;
    period: string | null;
    period_start: string | null;
    period_end: string | null;
  };
  denominator_total_ehfs: number;
  indicators: {
    in_full_delivery: {
      numerator: number;
      denominator: number;
      percent: number;
    };
    on_time_delivery: {
      numerator: number;
      denominator: number;
      percent: number;
    };
    stock_out_rate: {
      numerator: number;
      denominator: number;
      percent: number;
    };
    reorder_level_status: {
      numerator: number;
      denominator: number;
      percent: number;
    };
    cce_functionality_rate: {
      numerator: number;
      denominator: number;
      percent: number;
    };
    reverse_logistics_completion: {
      completed_returns: number;
      expected_returns: number;
      percent: number;
    };
    stock_adequate_per_facility: {
      numerator: number;
      denominator: number;
      percent: number;
    };
  };
}

// Facility within a ward
export interface FacilityType {
  id: number;
  name_of_ehf: string;
  assigned_unique_id: string;

  // Actual stock
  dose_bcg: number | null;
  dose_hepb: number | null;
  dose_bopv: number | null;
  dose_penta: number | null;
  dose_pcv: number | null;
  dose_ipv: number | null;
  dose_mea: number | null;
  dose_yf: number | null;
  dose_td: number | null;
  dose_mena: number | null;
  dose_rota: number | null;
  dose_hpv: number | null;
  mr: number | null;

  // Allocated stock
  dose_bcg_allocated: number | null;
  dose_hepb_allocated: number | null;
  dose_bopv_allocated: number | null;
  dose_penta_allocated: number | null;
  dose_pcv_allocated: number | null;
  dose_ipv_allocated: number | null;
  dose_mea_allocated: number | null;
  dose_yf_allocated: number | null;
  dose_td_allocated: number | null;
  dose_mena_allocated: number | null;
  dose_rota_allocated: number | null;
  dose_hpv_allocated: number | null;
  dose_mr_allocated: number | null;

  // Received stock
  dose_bcg_received: number | null;
  dose_hepb_received: number | null;
  dose_bopv_received: number | null;
  dose_penta_received: number | null;
  dose_pcv_received: number | null;
  dose_ipv_received: number | null;
  dose_mea_received: number | null;
  dose_yf_received: number | null;
  dose_td_received: number | null;
  dose_mena_received: number | null;
  dose_rota_received: number | null;
  dose_hpv_received: number | null;
  dose_mr_received: number | null;

  // Physical stock balance
  bcg_physical_stock_balance: number | null;
  hepb_physical_stock_balance: number | null;
  bopv_physical_stock_balance: number | null;
  penta_physical_stock_balance: number | null;
  pcv_physical_stock_balance: number | null;
  ipv_physical_stock_balance: number | null;
  mea_physical_stock_balance: number | null;
  yf_physical_stock_balance: number | null;
  td_physical_stock_balance: number | null;
  mena_physical_stock_balance: number | null;
  rota_physical_stock_balance: number | null;
  hpv_physical_stock_balance: number | null;
  mr_physical_stock_balance: number | null;
}

// Ward-level vaccine summary
export interface WardVaccineSummary {
  dose_bcg: number | null;
  dose_hepb: number | null;
  dose_bopv: number | null;
  dose_penta: number | null;
  dose_pcv: number | null;
  dose_ipv: number | null;
  dose_mea: number | null;
  dose_yf: number | null;
  dose_td: number | null;
  dose_mena: number | null;
  dose_rota: number | null;
  dose_hpv: number | null;
  mr: number | null;
  dose_bcg_allocated: number | null;
  dose_hepb_allocated: number | null;
  dose_bopv_allocated: number | null;
  dose_penta_allocated: number | null;
  dose_pcv_allocated: number | null;
  dose_ipv_allocated: number | null;
  dose_mea_allocated: number | null;
  dose_yf_allocated: number | null;
  dose_td_allocated: number | null;
  dose_mena_allocated: number | null;
  dose_rota_allocated: number | null;
  dose_hpv_allocated: number | null;
  dose_mr_allocated: number | null;

  // Received stock
  dose_bcg_received: number | null;
  dose_hepb_received: number | null;
  dose_bopv_received: number | null;
  dose_penta_received: number | null;
  dose_pcv_received: number | null;
  dose_ipv_received: number | null;
  dose_mea_received: number | null;
  dose_yf_received: number | null;
  dose_td_received: number | null;
  dose_mena_received: number | null;
  dose_rota_received: number | null;
  dose_hpv_received: number | null;
  dose_mr_received: number | null;

  // Physical stock balance
  bcg_physical_stock_balance: number | null;
  hepb_physical_stock_balance: number | null;
  bopv_physical_stock_balance: number | null;
  penta_physical_stock_balance: number | null;
  pcv_physical_stock_balance: number | null;
  ipv_physical_stock_balance: number | null;
  mea_physical_stock_balance: number | null;
  yf_physical_stock_balance: number | null;
  td_physical_stock_balance: number | null;
  mena_physical_stock_balance: number | null;
  rota_physical_stock_balance: number | null;
  hpv_physical_stock_balance: number | null;
  mr_physical_stock_balance: number | null;
}

// Ward with facilities (no LGA)
export interface LcsDashboardWardType {
  state: string;
  ward: string;
  sum_of_vaccine_at_ward_level: WardVaccineSummary;
  facilities: FacilityType[];
}

export type LcsDashboardType = LcsDashboardWardType[];
