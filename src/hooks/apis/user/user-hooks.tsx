import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { User } from './user-types';
import { url } from '../../api';

//const BASE_URL = 'https://jsonplaceholder.typicode.com';

type ApiResponse<T> = {
  status: string;
  data: T;
};

export const useFetchUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiHelper.getResource<ApiResponse<User[]>>(`${url}v1/user/`);
      return response.data;
    },
    // enabled: false, 
  });
};

export const useCreateUser = () => { 
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => 
      apiHelper.postResource<User>(`${url}v1/users`, newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      apiHelper.deleteResource<void>(`${url}v1/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};