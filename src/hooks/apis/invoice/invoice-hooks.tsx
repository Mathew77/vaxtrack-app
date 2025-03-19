import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { InvoiceType } from "./invoice-type";

type ApiResponse<T> = {
    status: string;
    data: T;
  };


export const useUpsertInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: Partial<InvoiceType> | Omit<InvoiceType, 'id'> }) =>
      id
        ? apiHelper.putResource<InvoiceType>(`${url}v1/invoice/${id}/`, data)
        : apiHelper.postResource<InvoiceType>(`${url}v1/invoice/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
    },
  });
};

