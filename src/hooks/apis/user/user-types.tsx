// types.ts
export interface User {
    id: number;
    password: string;
    last_login: string | null;
    is_superuser: boolean;
    username: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
    org_unit: string;
    active: boolean;
    created_by: string;
    created_date: string;
    modify_by: string | null;
    modify_date: string | null;
    fk_org_unit_level: string | null;
    groups: any[];
    user_permissions: any[];
  }
  