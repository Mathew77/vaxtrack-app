export type ThreePlType = {
    id?: number;
    status: string;
    state: string;  
    lga: string;    
    ward: string;   
    org_unit: string; 
    threepl_name: string;    
    ehf_list: string[]; 
  };

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