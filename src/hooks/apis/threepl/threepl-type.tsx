export type ThreePlType = {
    id?: number;
    status: string;
    state: string;
    lga: string;
    threepl_name: string;
    ehf_list: string[];
    category_type: string;
    state_list: string[];
    ccw: string;
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
