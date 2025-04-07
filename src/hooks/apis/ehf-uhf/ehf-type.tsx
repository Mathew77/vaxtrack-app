export interface EHFType {
  id?: number;
  status: string;
  state: string;
  lga: string;
  ward: string;
  ehf_name: string;
  longtitude: string;
  lagtitude: string;
  uhf_list: string[];
  contact_person_name: string;
  contact_person_phone: string;
  contact_person_email: string;
  storage_capcity?: number | null;
  equipment_model_number?: number | null;
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