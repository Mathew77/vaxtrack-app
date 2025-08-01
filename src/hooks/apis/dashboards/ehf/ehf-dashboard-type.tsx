
export interface EhfAntigenStock {
  ehf_id: number;
  above_max_stock_count: number;
  below_min_stock_count: number;
  out_of_stock_count: number;
  mismatch_count: number;
  total_threepl: number;
  less_than_6_months_rsl_count: number;
}

export interface EhfForwardReverseLogistic {
  ehf_id: number;
  monthly_logistics: {
    [key: string]: {
      forward_logistics: number;
      reverse_logistics: number;
    };
  };
}
 