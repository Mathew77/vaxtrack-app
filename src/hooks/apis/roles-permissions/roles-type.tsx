export interface RoleType {
    id?:  number;
    name: string;
    fk_org_unit_level_id: string; 
    permissions: string[]; 
    status: string;
  }

  export interface Permission {
    label: string;
    value: string;
  }

  export interface OrgUnit {
    id: string | number;
    name: string;
  }