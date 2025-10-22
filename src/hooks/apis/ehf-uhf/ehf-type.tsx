export interface EHFType {
  id?: number;
  status: string;
  state: string;
  lga: string;
  // ward: string;
  ehf_name: string;
  ehf_unique_id?: string;
  longtitude: string;
  lagtitude: string;
  uhf_list: string[];
  contact_person_name: string;
  contact_person_phone: string;
  contact_person_email: string;
  storage_capcity?: string;
  equipment_model_number?: string;
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

export interface VaccineStorageType {
  id: number;
  description: string;
  make: string;
  model: string;
  code: string;
  type: string;
  liters_plusfive: string;
  liters_minustwenty: string;
  remark: string;
}