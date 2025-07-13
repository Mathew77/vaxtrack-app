import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { UserType,RoleType, OrgUnit, StateOption } from './user-types';
import { url } from '../../api';
import { PermissionType } from '../roles-permissions/permissions-type';

//const BASE_URL = 'https://jsonplaceholder.typicode.com';

type ApiResponse<T> = {
  status: string;
  data: T;
};

export const useFetchUsers = () => {
  return useQuery<UserType[], Error>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiHelper.getResource<ApiResponse<UserType[]>>(`${url}v1/user/`);
      return response.data;
    },
    // enabled: false, 
  });
};


export const useUpsertUser = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, data }: { id?: number; data: Partial<UserType> | Omit<UserType, 'id'> }) =>
          id
            ? apiHelper.putResource<UserType>(`${url}v1/user/${id}/`, data)
            : apiHelper.postResource<UserType>(`${url}v1/user/`, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['user'] });
        },
      });
    };

    export const useFetchOrgUnitLevel = () => {
      return useQuery<OrgUnit[], Error>({
        queryKey: ['orgLevel'],
        queryFn: async () => {
          const response = await apiHelper.getResource<ApiResponse<OrgUnit[]>>(`${url}v1/org-unit-level/`);
          return response.data;
        },
      });
    };

  // export const useFetchOrgUnits = () => {
  //   return useQuery<OrgUnit[], Error>({
  //     queryKey: ['orgUnits'],
  //     queryFn: async () => {
  //       const response = await apiHelper.getResource<ApiResponse<OrgUnit[]>>(`${url}v1/org-unit/`);
  //       return response.data;
  //     },
  //   });
  // };

  export const useFetchRoles = () => {
    return useQuery<RoleType[], Error>({
      queryKey: ['auth-group'],
      queryFn: async () => {
        const response = await apiHelper.getResource<ApiResponse<RoleType[]>>(`${url}v1/auth-group/`);
        return response.data;
      },
    });
  };


  // export const useFetchPermissions = () => {
  //     return useQuery<PermissionType[], Error>({
  //       queryKey: ['permissions'],
  //       queryFn: async () => {
  //         const response = await apiHelper.getResource<ApiResponse<PermissionType[]>>(
  //           `${url}v1/permission/`
  //         );
  //         return response.data;
  //       },
  //     });
  //   };

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      apiHelper.deleteResource<void>(`${url}v1/user/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

  export const useFetchStates = () => {
    return useQuery({
      queryKey: ['states'],
      queryFn: async (): Promise<StateOption[]> => {
        const response = await apiHelper.getResource<any[]>(
          `${url}v1/states/`
        );
        return response.map((item, index) => ({
          id: item.state || `state-${index}`,
          name: item.state, 
          ehf_list: item.ehf_list || [], 
        }));
      },
    });
  };