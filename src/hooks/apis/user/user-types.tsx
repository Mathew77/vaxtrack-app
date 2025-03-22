// types.ts
export interface UserType {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  email: string;
  phone_number: string;
  org_unit: string;
  groups: string[] | number[]; 
  user_permissions: string[] | number[];
}

  export interface RoleType {
    id: number;
    name: string;
  }

  export interface OrgUnit {
    id:  number;
    name: string;
  }
  