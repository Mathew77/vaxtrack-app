// user-api.ts
import api from '../../api';
import { User } from './user-types';
import axios from 'axios';

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/user/');
  console.log(response.data.data)
  return response.data;
};

// Create a new user
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await axios.post<User>('/users/', userData);
  return response.data;
};

// Function to update a user
export const updateUser = async (userData: User): Promise<User> => {
  const response = await axios.put<User>(`/api/users/${userData.id}`, userData);
  return response.data;
};

// Function to delete a user
export const deleteUser = async (userId: number): Promise<void> => {
  await axios.delete(`/api/users/${userId}`);
};
