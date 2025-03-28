import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { url } from "src/hooks/api";
import { VaccineFormType } from "./ehf-type";
import { UserType } from "../user/user-types";

type ApiResponse<T> = {
    status: string;
    data: T;
  };

  export const useCreateVaccine = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: VaccineFormType) =>
        apiHelper.postResource<VaccineFormType>(`${url}v1/vaccine-request/`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vaccine'] }); 
      },
    });
  };

  export const useFetchUsers = () => {
    return useQuery<UserType[], Error>({
      queryKey: ['user'],
      queryFn: async () => {
        try {
          const response = await apiHelper.getResource<ApiResponse<UserType[]>>(`${url}v1/user/`);   
          const usersWithEhf = response.data.filter(user => 
            user.ehf_list && user.ehf_list.length > 0
          );
          return usersWithEhf.length > 0 ? usersWithEhf : response.data;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },

    });
  };
