export enum Button {
  Login = 'Войти',
  Logout = 'Выйти',
  Register = 'Зарегистрироваться'
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}
