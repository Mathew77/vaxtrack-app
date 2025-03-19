export interface SCSType {
    id?: number;
    status: string;
    stat_id: string;
    scs_name: string;
    contact_person_name?: string;
    contact_person_phone?: string;
    contact_person_email?: string;
    longtitude: string; 
    lagtitude: string;  
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