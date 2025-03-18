import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { RoleType, OrgUnit} from './roles-type';
import { url } from '../../api';
import { PermissionType } from './permissions-type';

type ApiResponse<T> = {
    status: string;
    data: T;
  };
  
  export const useFetchRoles = () => {
    return useQuery<RoleType[], Error>({
      queryKey: ['auth-group'],
      queryFn: async () => {
        const response = await apiHelper.getResource<ApiResponse<RoleType[]>>(`${url}v1/auth-group/`);
        return response.data;
      },
    });
  };
  
//   export const useFetchRole = (roleId: string | number) => {
//     return useQuery<RoleType, Error>({
//       queryKey: ['role', roleId],
//       queryFn: async () => {
//         const response = await apiHelper.getResource<ApiResponse<RoleType>>(`${url}v1/roles/${roleId}/`);
//         return response.data;
//       },
//       enabled: !!roleId, 
//     });
//   };
  
  

export const useUpsertRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: Partial<RoleType> | Omit<RoleType, 'id'> }) =>
      id
        ? apiHelper.putResource<RoleType>(`${url}v1/auth-group/${id}/`, data)
        : apiHelper.postResource<RoleType>(`${url}v1/auth-group/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-group'] });
    },
  });
};
  
  export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string | number) => 
        apiHelper.deleteResource<void>(`${url}v1/auth-group/${id}/`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth-group'] });
      },
    });
  };

//   export const useFetchPermissions = () => {
//     return useQuery<Permission[], Error>({
//       queryKey: ['permissions'],
//       queryFn: async () => {
//         const response = await apiHelper.getResource<ApiResponse<any>>(`${url}v1/permission/`);
//         const permissions = Array.isArray(response.data) ?
//           response.data.map((permission: any) => ({
//             label: permission.name,
//             value: permission.id.toString(),
//           })) : [];
//         return permissions;
//       },
//     });
//   };

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
  
  export const useFetchOrgUnits = () => {
    return useQuery<OrgUnit[], Error>({
      queryKey: ['orgUnits'],
      queryFn: async () => {
        const response = await apiHelper.getResource<ApiResponse<OrgUnit[]>>(`${url}v1/org-unit-level/`);
        return response.data;
      },
    });
  };