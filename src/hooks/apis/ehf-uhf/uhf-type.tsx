export interface UHFType {
    id?: number;
    status?: string;
    state: string;
    lga: string;
    // ward?: string;
    contact_person_name: string | null;
    contact_person_phone: string | null;
    contact_person_email: string | null;
    assigned_ehf_unique_id: string;
    uhf_name: string;
    longtitude: string | null;
    lagtitude: string | null;
    created_by?: string;
    created_date?: string;
    modify_by?: string | null;
    modify_date?: string;
}

export interface StateType {
    state: string;
}

export interface LgaType {
    lga: string;
  }

  export interface WardType {
    ward: string;
  }

  export interface OrgUnit {
    id: string | number;
    name: string;
  }

  export interface HFAType {
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
    total_vaccine_storage_volume_utilized: string;
    remaining_cce_storage_capacity: string;
    remark: string | null;
    created_at: string;
    updated_at: string;
    latitude?: number;
    longitude?: number;
}