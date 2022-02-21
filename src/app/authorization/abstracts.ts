export enum Button {
  Login = 'Войти',
  Logout = 'Выйти',
  Register = 'Зарегистрироваться'
}

export enum ErrorMessages {
  emailInUsed = 'This email already in use!',
  incorrectEmail = 'Incorrect e-mail or password'
}

export enum Data {
  token = 'token',
  refreshToken = 'refreshToken',
  userId = 'userId',
  name = 'name',
  tokenCreationDate = 'tokenCreationDate'
}

// пользователь на основе формы регистрации
export interface IUserRegister {
  name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

// статус ответа сервера
export interface IStatus {
  status: number;
}

// ответ сервера при создании пользователя
export interface IUserRegisterResponse {
  id: string;
  name: string;
  email: string;
}

// ответ сервера при авторизации
export interface IUserAuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
