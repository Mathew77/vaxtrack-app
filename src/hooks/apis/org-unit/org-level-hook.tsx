import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { OrgLevelType } from './org-level-type';
import { url } from '../../api';

type ApiResponse<T> = {
  status: string;
  data: T;
};

export const useFetchOrgLevels = () => {
  return useQuery<OrgLevelType[], Error>({
    queryKey: ['orgLevels'],
    queryFn: async () => {
      const response = await apiHelper.getResource<ApiResponse<OrgLevelType[]>>(
        `${url}v1/org-unit-level/`
      );
      return response.data;
    },
  });
};


export const useUpsertOrgLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: OrgLevelType | Omit<OrgLevelType, 'id'> }) =>
      id
        ? apiHelper.putResource<OrgLevelType>(`${url}v1/org-unit-level/${id}/`, data)
        : apiHelper.postResource<OrgLevelType>(`${url}v1/org-unit-level/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgLevels'] });
    },
  });
};

export const useDeleteOrgLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => apiHelper.deleteResource<void>(`${url}v1/org-unit-level/${id}/`), 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orgLevels'] });
      },
    });
  };