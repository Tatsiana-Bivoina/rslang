import {
  IStatus,
  IUserRegister,
  IUserAuthResponse,
  IUserLogin,
  IUserRegisterResponse,
  ErrorMessages
} from './abstracts';
import { Menu, SERVER_URL } from '../abstracts';
import { UserData } from './storage';
import { drawPage } from '../app';
import { mainView } from '../main/view';

const userData = new UserData();

// создание пользователя
async function createUser(form: HTMLFormElement): Promise<IUserRegisterResponse | IStatus> {
  const user = getUserData(form);
  // console.log(`start creating user ${JSON.stringify(user)}`);
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
  // console.log(`jsonResponse: ${JSON.stringify(jsonResponse)}`);
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
  // console.log(`jsonResponse: ${JSON.stringify(jsonResponse)}`);
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

// отрисовка приветствия в меню
export function drawUserInfo() {
  const name = userData.name;
  const loginField = document.querySelector('.login') as HTMLSpanElement;
  if (name) {
    const loginHtml = `
    Привет, ${name}
    <span class="dropdown-content">
      <span class="dropdown-content__item item-exit">Выйти</span>
    </span>
    `;
    loginField.innerHTML = loginHtml;

    // показать выпадающее меню при клике
    const dropDownContent = loginField.querySelector('.dropdown-content') as HTMLSpanElement;
    loginField.addEventListener('click', () => {
      dropDownContent.classList.toggle('show');
    });

    // закрывать раскрывающийся список при клике за его пределами
    window.addEventListener('click', (event) => {
      const target = event.target as Element;

      // проверяем, что кликаем не по кнопке логина
      if (!target.matches('.login')) {
        if (target.matches('.item-exit')) {
          // если кликаем по кнопке "Выход"
          logOut();
          localStorage.removeItem('authorized');
          return;
        }
        if (dropDownContent.classList.contains('show')) {
          dropDownContent.classList.remove('show');
        }
      }
    });
  } else {
    loginField.innerHTML = Menu.login;
  }
}

// вызывается при регистрации нового пользователя
export async function register(form: HTMLFormElement): Promise<boolean> {
  const registerResponse = await createUser(form);
  if (Object.keys(registerResponse).includes('status') && (registerResponse as IStatus).status === 417) {
    const error = form.querySelector('.error-msg') as HTMLDivElement;
    error.innerHTML = ErrorMessages.emailInUsed;
    return false;
  }
  return await login(form);
}

// вызывается при логине
export async function login(form: HTMLFormElement): Promise<boolean> {
  const { email, password } = getUserData(form);
  const user: IUserLogin = { email: email, password: password };
  const loginResponse: IUserAuthResponse | IStatus = await authUser(user);
  if (Object.keys(loginResponse).includes('status')) {
    const error = form.querySelector('.error-msg') as HTMLDivElement;
    error.innerHTML = ErrorMessages.incorrectEmail;
    return false;
  }

  // сохраним все данные в localStorage
  userData.saveData(loginResponse as IUserAuthResponse);
  drawUserInfo();
  // вернем true, если логин успешен
  return true;
}

// вызывается при логауте
function logOut() {
  userData.clear();
  drawPage(mainView);
  drawUserInfo();
}
