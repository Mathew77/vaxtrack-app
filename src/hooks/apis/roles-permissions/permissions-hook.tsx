import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { url } from '../../api';
import { PermissionType, ApiResponse } from './permissions-type';



export const useFetchPermissions = () => {
    return useQuery<PermissionType[], Error>({
      queryKey: ['permissions'],
      queryFn: async () => {
        const response = await apiHelper.getResource<ApiResponse<PermissionType[]>>(
          `${url}v1/permission/` 
        );
        return response.data;
      },
    });
  };

  export const useCreatePermission = () => {
    const queryClient = useQueryClient();
    return useMutation<PermissionType, Error, Omit<PermissionType, 'id'>>({
      mutationFn: async (newPermission) => {
        const response = await apiHelper.postResource<ApiResponse<PermissionType>>(
          `${url}v1/permission/`, 
          newPermission
        );
        return response.data; 
      },
    });
  };