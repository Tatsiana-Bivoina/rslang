import {
  IStatus,
  IUserRegister,
  IUserAuthResponse,
  IUserLogin,
  IUserRegisterResponse,
  ErrorMessages
} from './abstracts';
import { SERVER_URL } from '../abstracts';

// создание пользователя
async function createUser(form: HTMLFormElement): Promise<IUserRegisterResponse | IStatus> {
  const user = getUserData(form);
  console.log(`start creating user ${JSON.stringify(user)}`);
  const rawResponse = await fetch(`${SERVER_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  let jsonResponse;

  if (rawResponse.status === 200) {
    jsonResponse = await rawResponse.json();
  } else {
    jsonResponse = { status: rawResponse.status };
  }
  console.log(`jsonResponse: ${JSON.stringify(jsonResponse)}`);
  return jsonResponse;
}

// авторизация пользователя
async function authUser(user: IUserLogin): Promise<IUserAuthResponse | IStatus> {
  const rawResponse = await fetch(`${SERVER_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  let jsonResponse;

  if (rawResponse.status === 200) {
    jsonResponse = await rawResponse.json();
  } else {
    jsonResponse = { status: rawResponse.status };
  }
  console.log(`jsonResponse: ${JSON.stringify(jsonResponse)}`);
  return jsonResponse;
}

// преобразование данных формы в объект
function getUserData(form: HTMLFormElement): IUserRegister {
  const fd = new FormData(form);
  const user: IUserRegister = {
    name: (fd.get('name') as string) || 'empty',
    password: fd.get('password') as string,
    email: fd.get('email') as string
  };
  return user;
}

// сохранение данных в localStorage
function saveData(userData: IUserAuthResponse | IStatus) {
  const data = JSON.stringify(userData);
  localStorage.setItem('data', data);
}

// отрисовка приветствия в меню
export function drawUserInfo() {
  const dataStr = localStorage.getItem('data');
  const loginField = document.querySelector('.login') as HTMLSpanElement;
  let loginHtml = 'Вход';
  if (dataStr !== null) {
    const dataObj: IUserAuthResponse = JSON.parse(dataStr);
    const name = dataObj['name'];
    loginHtml = `Привет, ${name}`;
  }
  loginField.innerText = loginHtml;
}

// вызывается при регистрации нового пользователя
export async function register(form: HTMLFormElement) {
  const registerResponse = await createUser(form);
  if (Object.keys(registerResponse).includes('status') && (registerResponse as IStatus).status === 417) {
    const error = form.querySelector('.error-msg') as HTMLDivElement;
    error.innerHTML = ErrorMessages.emailInUsed;
    return;
  }
  await login(form);
}

// вызывается при логине
export async function login(form: HTMLFormElement) {
  const { email, password } = getUserData(form);
  const user: IUserLogin = { email: email, password: password };
  const loginResponse: IUserAuthResponse | IStatus = await authUser(user);
  if (Object.keys(loginResponse).includes('status')) {
    const error = form.querySelector('.error-msg') as HTMLDivElement;
    error.innerHTML = ErrorMessages.incorrectEmail;
    return;
  }
  saveData(loginResponse);
  drawUserInfo();
}
