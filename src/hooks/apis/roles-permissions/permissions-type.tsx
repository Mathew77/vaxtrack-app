export interface PermissionType {
  id: number;
  name: string;
  codename: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}