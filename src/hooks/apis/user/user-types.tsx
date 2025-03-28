export interface UserType {
  id?: number;
  status: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  email: string;
  phone_number: string;
  groups: number[];
  ncs_list?: string[]; 
  scs_list?: string[]; 
  lcs_list?: string[]; 
  ehf_list?: string[]; 
  uhf_list?: string[];
  health_facility_category?: string | null;

}

  export interface RoleType {
    id: number;
    name: string;
  }

  export interface OrgUnit {
    id:  number;
    name: string;
  }
  