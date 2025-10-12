export type Role = "user" | "admin";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role; 
}

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agree: boolean;
}
