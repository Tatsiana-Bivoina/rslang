export enum Button {
  Login = 'Войти',
  Logout = 'Выйти',
  Register = 'Зарегистрироваться'
}

export enum ErrorMessages {
  loginInUsed = 'This login already in use!'
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
}

export interface IStatus {
  status: number;
}
