export interface NCSType {
    id?: number;
    status: string;
    state: string;
    ncs_name: string;
    state_list: string[];
    utilization_factor: number;
    storage_capcity: number;  
    vaccine_volume: number;
  }

  export interface StateType {
    state: string;
  }