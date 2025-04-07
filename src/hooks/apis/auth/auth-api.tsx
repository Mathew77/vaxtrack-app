
// import { apiHelper } from '../apiHelper';

import axios from 'axios';

const BASE_URL = 'https://vaxtracklmd.net/api';

export interface LoginResponse {
  username: string;
  access: string | null;
  token: string;
  userdata: {
    first_name: string;
    last_name: string;
    groups: { id: number; name: string }[];
    user_permissions: { id: number; name: string }[];
  };
}

export interface LoginVariables {
  username: string;
  password: string;
}

export const login = async ({ username, password }: LoginVariables): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/token/`, {
    username,
    password,
  });
  return response.data;
};