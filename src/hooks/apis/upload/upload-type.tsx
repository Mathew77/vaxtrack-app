export interface UploadResponse {
  imported_at: string;
  sheet: string;
  rows_processed: number;
  created: number;
  updated: number;
  errors: Array<{
    sheet_row: number;
    field: string;
    raw: string;
    error: string;
  }>;
}

export interface UploadError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface StockAtHandData {
  id: number;
  serial_no: number;
  state: string;
  lga: string;
  ward: string;
  name_of_ehf: string;
  assigned_unique_id: string;
  distance_km_from_scs: string;
  est_travel_hours_from_scs: string;
  delivery_route: string | null;
  offering_ri_services: string;
  reason_not_offering_ri: string | null;
  cce_count: number;
  cce_model: string;
  cce_functionality_status: string;
  cce_capacity_l: string;
  hard_to_reach: string;
  phone_number: string;
  dose_bcg: number;
  dose_hepb: number;
  dose_bopv: number;
  dose_penta: number;
  dose_pcv: number;
  dose_ipv: number;
  dose_mea: number;
  dose_yf: number;
  dose_td: number;
  dose_mena: number;
  dose_rota: number;
  dose_hpv: number;
  total_vaccine_storage_volume_utilized: string;
  remaining_cce_storage_capacity: string;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

export interface AllocationSubmitData {
  ehf_id: number;
  assigned_unique_id: string;
  period: string;
  dose_bcg_actual: number;
  dose_bcg_allocated: number;
  dose_hepb_actual: number;
  dose_hepb_allocated: number;
  dose_bopv_actual: number;
  dose_bopv_allocated: number;
  dose_penta_actual: number;
  dose_penta_allocated: number;
  dose_pcv_actual: number;
  dose_pcv_allocated: number;
  dose_ipv_actual: number;
  dose_ipv_allocated: number;
  dose_mea_actual: number;
  dose_mea_allocated: number;
  dose_yf_actual: number;
  dose_yf_allocated: number;
  dose_td_actual: number;
  dose_td_allocated: number;
  dose_mena_actual: number;
  dose_mena_allocated: number;
  dose_rota_actual: number;
  dose_rota_allocated: number;
  dose_hpv_actual: number;
  dose_hpv_allocated: number;
}

export interface AllocatedVaccineData {
  id: number;
  period: string;
  assigned_unique_id: string;
  dose_bcg_actual: number;
  dose_bcg_allocated: number;
  dose_hepb_actual: number;
  dose_hepb_allocated: number;
  dose_bopv_actual: number;
  dose_bopv_allocated: number;
  dose_penta_actual: number;
  dose_penta_allocated: number;
  dose_pcv_actual: number;
  dose_pcv_allocated: number;
  dose_ipv_actual: number;
  dose_ipv_allocated: number;
  dose_mea_actual: number;
  dose_mea_allocated: number;
  dose_yf_actual: number;
  dose_yf_allocated: number;
  dose_td_actual: number;
  dose_td_allocated: number;
  dose_mena_actual: number;
  dose_mena_allocated: number;
  dose_rota_actual: number;
  dose_rota_allocated: number;
  dose_hpv_actual: number;
  dose_hpv_allocated: number;
  slwg_user: string | null;
  status: number;
  created_by: string;
  modify_by: string | null;
  date_created: string;
  modify_date: string;
}
