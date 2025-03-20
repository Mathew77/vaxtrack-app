import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { InvoiceType } from "./invoice-type";


export interface MinimalInvoicePayload {
  waybill_number: string;
  delivery_proof?: File | string;
}

type ApiResponse<T> = {
  status: string;
  data: T;
};

export const useFetchInvoice = () => {
  return useQuery<InvoiceType[], Error>({
    queryKey: ['invoice'],
    queryFn: async () => {
      const response = await apiHelper.getResource<ApiResponse<InvoiceType[]>>(
        `${url}v1/invoice/`
      );
      return response.data;
    },
  });
};

export const useUpsertInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: MinimalInvoicePayload | Partial<InvoiceType> | Omit<InvoiceType, 'id'> }) =>
      id
        ? apiHelper.putResource<InvoiceType>(`${url}v1/invoice/${id}/`, data)
        : apiHelper.postResource<InvoiceType>(`${url}v1/invoice/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
    },
  });
};