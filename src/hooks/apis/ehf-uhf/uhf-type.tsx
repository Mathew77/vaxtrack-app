export interface UHFType {
    id?: number;
    status: string;
    state: string;
    lga: string;
    ward: string;
    contact_person_name: string;
    contact_person_phone: string;
    contact_person_email: string;
    org_unit: string;
    uhf_name: string;
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