import httpClient from '../../httpClient';

interface User {
  id: number;
  name: string;
  email: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await httpClient.get<User[]>('/users');
  return response.data;
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await httpClient.post<User>('/users', userData);
  return response.data;
};

// Add more API functions as needed
