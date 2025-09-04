export interface NCSType {
  id?: number;
  status: string;
  state: string;
  ncs_name: string;
  state_list: string[];
  storage_capcity: string;
}

export interface StateType {
  state: string;
}