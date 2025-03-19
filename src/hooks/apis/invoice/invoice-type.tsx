export interface InvoiceType {
    id?: number;
    invoice_number: string;
    carrier_name: string;
    waybill_number: string;
    status: string;
    approval_date: string;
    payment_date: string;
    remark?: string;
    payment_rate: string;
    delivery_proof: string;
    payment_request: string;
    payment_request_date: string;
    approved_by: string;
    created_by: string;
  }