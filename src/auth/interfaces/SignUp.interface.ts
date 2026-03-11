export interface SignUpInterface {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInInterface {
  email: string;
  password: string;
}
