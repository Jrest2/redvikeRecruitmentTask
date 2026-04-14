export interface UserPayload {
  id: number;
  email: string;
  name?: string | null;
  surname?: string | null;
}

export interface AuthResponse {
  user: UserPayload;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface LoginResponse {
  user: UserPayload;
  otpId: string;
  mfaRequired: boolean;
}
