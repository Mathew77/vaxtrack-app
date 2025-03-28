// ehf-type.tsx
export interface VaccineFormType {
    status?: string; 
    username?: string;
    ehf_id?: number; 
    product_detail_request: string[];
    requested_by: string;
  }