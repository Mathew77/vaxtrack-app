export interface LcsType {
    id?: number;
    status: string;
    stat_id: string; 
    lga_id: string; 
    lcs_name: string;
    longtitude: string;
    lagtitude: string;
    contact_person_name: string;
    contact_person_phone: string;
    contact_person_email: string;
    storage_capcity: number;
    utilization_factor: number;
    vaccine_volume: number;
    doses_vial: number;
    packing_factor: number; 
    buffer_stock: number; 
    max_vial: number; 
    max_doses: number; 
    adjusted_max_doses: number; 
}


export interface StateType {
state: string;
}

export interface LgaType {
    lga: string;
  }

  