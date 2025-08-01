
export interface AdminLogisticStock {
  percentage_ehf_lmd_orders: number;
  percentage_ehf_lmd_orders_serviced: number;
  percentage_uhf_forward_logistics: number;
  percentage_uhf_reverse_logistics: number;        
}

export interface AdminAntigenStock {
  total_antigens: number;
  below_min_stock: {
    count: number;
    percentage: number;
  };
  above_max_stock: {
    count: number;
    percentage: number;
  };
  out_of_stock: {
    count: number;
    percentage: number;
    }
}


export interface MonthlyAntigenStock {
  month: string;
  total: number;
  below_min_count: number;
  above_max_count: number;
  out_of_stock_count: number;
}