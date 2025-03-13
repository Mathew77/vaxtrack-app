
// import { apiHelper } from '../apiHelper';

import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

export interface LoginResponse {
  username: string;
  access: string | null;
  token: string;
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