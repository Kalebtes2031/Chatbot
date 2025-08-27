// User type returned from backend profile API
export interface User {
  id: number;
  username: string;
  email: string;
  // optional fields you might add later
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

// Login request payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Login response (from JWT create endpoint)
export interface LoginResponse {
  access: string;
  refresh: string;
}

// Signup / Registration payload
export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

// Signup response
export interface SignupResponse {
  id: number;
  username: string;
  email: string;
}
