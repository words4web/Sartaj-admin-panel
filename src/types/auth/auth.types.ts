// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: User;
}

export enum EAdminRole {
  ADMIN = "superAdmin",
  SUB_ADMIN = "subAdmin",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: EAdminRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
