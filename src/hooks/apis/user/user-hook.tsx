import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { fetchUsers, createUser } from './user-api-functions';
import { User } from './user-types'; // Adjust the path as necessary

const useFetchUsers = () => {
  return useQuery<User[], AxiosError>(['users'], fetchUsers);
};

const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(createUser, {
    onSuccess: () => {
      // Invalidate and refetch users query after a new user is created
      queryClient.invalidateQueries(['users']);
    },
  });
};

// Add more custom hooks as needed
