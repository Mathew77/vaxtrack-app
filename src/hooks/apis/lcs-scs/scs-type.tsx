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
  }

  export interface StateType {
    state: string;
}