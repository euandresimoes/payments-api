export type RegisterModel = {
  email: string;
  username: string;
  password: string;
};

export const RegisterSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'email', 'password'],
};

export type LoginModel = {
  email: string;
  password: string;
};

export const LoginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
};
