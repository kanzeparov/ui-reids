export interface AuthResult {
  token: string;
}

export interface AuthResponse {
  auth: AuthResult;
}

export interface AuthParams {
  email: string;
  password: string;
}

