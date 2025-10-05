export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agree: boolean;
};

export type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};
