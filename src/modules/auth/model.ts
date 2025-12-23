export type RegisterModel = {
  email: string;
  username: string;
  password: string;
};

export type LoginModel = {
  email: string;
  password: string;
};

export type RequestUser = {
  id: string;
  email: string;
  username: string;
};
