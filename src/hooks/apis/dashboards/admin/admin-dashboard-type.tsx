export interface AdminLogisticStock {
  percentage_ehf_lmd_orders: number;
  percentage_ehf_lmd_orders_serviced: number;
  percentage_uhf_forward_logistics: number;
  percentage_uhf_reverse_logistics: number;
}

export interface AdminAntigenStock {
  total_antigens: number;
  below_min_stock: {
    count: number;
    percentage: number;
  };
  above_max_stock: {
    count: number;
    percentage: number;
  };
  out_of_stock: {
    count: number;
    percentage: number;
    }
}


export interface MonthlyAntigenStock {
  month: string;
  total: number;
  below_min_count: number;
  above_max_count: number;
  out_of_stock_count: number;
}

// Admin Dashboard - State level drill-down types
export interface AdminIndicatorsResponse {
  filters: {
    state: string | null;
    lga: string | null;
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
export interface AdminFacilityType {
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
}

// Ward vaccine summary
export interface AdminWardVaccineSummary {
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
}

// Ward with facilities
export interface AdminDashboardWardType {
  state: string;
  lga: string;
  ward: string;
  sum_of_vaccine_at_ward_level: AdminWardVaccineSummary;
  facilities: AdminFacilityType[];
}

// LGA with wards
export interface AdminDashboardLgaType {
  state: string;
  lga: string;
  sum_of_vaccine_at_lga_level: AdminWardVaccineSummary;
  wards: AdminDashboardWardType[];
}

// State with LGAs
export interface AdminDashboardStateType {
  state: string;
  sum_of_vaccine_at_state_level: AdminWardVaccineSummary;
  lgas: AdminDashboardLgaType[];
}

export type AdminDashboardType = AdminDashboardStateType[];