// user-hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { fetchUsers, createUser, updateUser, deleteUser } from './user-api-functions';
import { User } from './user-types';
//import axios from 'axios';

// Fetch all users
export const useFetchUsers = () => {
    return useQuery<User[], AxiosError>({
      queryKey: ['users'],
      queryFn: fetchUsers,
    });
  };

// Create a new user
export const useCreateUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation<User, AxiosError, Omit<User, 'id'>>({
      mutationFn: createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  };

// Update an existing user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation<User, AxiosError, User>({
      mutationFn: updateUser,
      onSuccess: () => {
        // Invalidate and refetch the users query after a user is updated
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  };

// Delete a user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation<void, AxiosError, number>({
      mutationFn: deleteUser,
      onSuccess: () => {
        // Invalidate and refetch the users query after a user is deleted
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  };
