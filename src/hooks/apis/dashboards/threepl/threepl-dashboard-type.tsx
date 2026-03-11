export interface ThreePlIndicatorsResponse {
  filters: {
    assigned_unique_ids: string[];
    assigned_ids_applied: string[];
    period: string | null;
    period_start: string | null;
    period_end: string | null;
  };
  totals?: {
    total_lmd_orders_assigned: number;
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
    reverse_logistics_completion: {
      completed_returns: number;
      expected_returns: number;
      percent: number;
    };
  };
}

// Facility within an EHF
export interface ThreePlFacilityType {
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
  dose_mr: number | null;
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

// Vaccine summary at EHF level
export interface ThreePlVaccineSummary {
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
  dose_mr: number | null;
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

// EHF with facilities
export interface ThreePlEHFType {
  ehf_name: string;
  assigned_unique_id: string;
  sum_of_vaccine_at_ehf_level: ThreePlVaccineSummary;
  facilities: ThreePlFacilityType[];
}

export type ThreePlDashboardType = ThreePlEHFType[];
