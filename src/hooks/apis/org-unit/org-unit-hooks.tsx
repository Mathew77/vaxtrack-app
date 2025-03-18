import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { OrgUnitType } from './org-unit-type';
import { url } from '../../api';

type ApiResponse<T> = {
  status: string;
  data: T;
};

export const useFetchOrgUnits = () => {
  return useQuery<OrgUnitType[], Error>({
    queryKey: ['orgUnit'],
    queryFn: async () => {
      const response = await apiHelper.getResource<ApiResponse<OrgUnitType[]>>(
        `${url}v1/org-unit/`
      );
      return response.data;
    },
  });
};

export const useDeleteOrgUnit = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => apiHelper.deleteResource<void>(`${url}v1/org-unit/${id}/`), 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orgUnit'] });
      },
    });
  };