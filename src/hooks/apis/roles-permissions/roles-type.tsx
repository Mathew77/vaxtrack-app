// export interface RoleType {
//     id?:  number;
//     name: string;
//     fk_org_unit_level_id: string;
//     org_unit_level_name: string;
//     permissions: string[];
//     status: string;
//   }


export interface RoleType {
   id?: number;
   name: string;
   fk_org_unit_level_id: string;
   org_unit_level_name: string;
   permissions: string[]; 
   status: string;
}


export interface RoleAPIPayload {
   id?: number;
   name: string;
   fk_org_unit_level_id: string | number;
   org_unit_level_name: string;
   permissions: number[];
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