// Summary/Statistics Types
export interface SlwgSummaryType {
  Total_EHF_LMD_Order_Received: number;
  Total_EHF_LMD_Order_Serviced: number;
  Total_EHF_LMD_Order_Serviced_in_Full: number;
  Total_Vaccine_expired: number;
}

// Facility within a ward
export interface FacilityType {
  id: number;
  serial_no: number;
  name_of_ehf: string;
  assigned_unique_id: string;
  distance_km_from_scs: number;
  est_travel_hours_from_scs: number;
  delivery_route: string | null;
  offering_ri_services: string;
  reason_not_offering_ri: string | null;
  cce_count: number;
  cce_model: string;
  cce_functionality_status: string;
  cce_capacity_l: number;
  hard_to_reach: string;
  phone_number: string;
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
  total_vaccine_storage_volume_utilized: number;
  remaining_cce_storage_capacity: number;
  remark: string | null;
  created_at: string;
  updated_at: string;
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
export interface SlwgDashboardWardType {
  state: string;
  lga: string;
  ward: string;
  sum_of_vaccine_at_ward_level: WardVaccineSummary;
  facilities: FacilityType[];
}

export type SlwgDashboardType = SlwgDashboardWardType[];
