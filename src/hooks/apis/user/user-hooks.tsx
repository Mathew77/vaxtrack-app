import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHelper } from '../apiHelper';
import { User } from './user-types';
import {url} from '../../api'


const BASE_URL = 'https://jsonplaceholder.typicode.com';

  export const useFetchUsers = () => {
    return useQuery<User[], Error>({
      queryKey: ['users'],
      queryFn: () => apiHelper.getResource<User[]>(`${BASE_URL}/users`),
      // enabled: false, 
    });
  };
  
  export const useCreateUser = () => { 
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (newUser: Omit<User, 'id'>) => 
        apiHelper.postResource<User>(`${BASE_URL}/users`, newUser),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  };

  // export const useCreateUser = () => { 
  //   const queryClient = useQueryClient();
  //   return useMutation({
  //     mutationFn: (newUser: Omit<User, 'id'>) => 
  //       apiHelper.postResource<User>(`${BASE_URL}/users`, newUser),
  //     onSuccess: (data) => {
  //       queryClient.setQueryData<User[]>(['users'], (oldUsers) => {
  //         if (!oldUsers) return [data];
  //         return [...oldUsers, data];
  //       });
  //     },
  //     onError: () => {
  //       queryClient.invalidateQueries({ queryKey: ['users'] });
  //     },
  //   });
  // };
  
  export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => 
        apiHelper.deleteResource<void>(`${BASE_URL}/users/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  };