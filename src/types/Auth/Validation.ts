export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
