  export interface VaccineFormType {
    id?: number;
    status?: string;
    username?: string;
    ehf_name?: string;
    ehf_id?: string;
    requested_by: string;
    vaccine_status?: number;
    decline_comment?: string;
    product_detail_request: Array<{
      type: string;
      [key: string]: any; 
    }>;
  }


 export interface VaccineAllocationDetail {
  type: string;
  ehf_id: number;
  uhf_id: number;
  uhf_name: string; 
  request_id: string;
  status: number;
  username: string;
  state: string;
  lga: string;
  [key: string]: any;
}

export interface VaccineAllocationType {
  id?: number;
  status?: string;
  vaccines_allocation_detail: VaccineAllocationDetail[];
}

export interface UHFType {
    id: number;
    name: string;
    uhf_name: string; 
    state: string;
    lga: string;
  }


  // export interface EHFType {
  //   id: number;
  //   name: string;
  //   ehf_name: string; 
  //   state: string;
  // }
