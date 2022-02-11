import { createDiv } from '../utils';
import { Button } from './abstracts';
import { login, register } from './controller';
import { mainView } from '../main/view';
import { drawPage } from '../app';

export async function loginView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__authorization');
  page.innerHTML = 'Registration page';

  const registrationDivForm: HTMLDivElement = createDiv(
    `
  <form action="/" method="post" enctype="multipart/form-data" class="form form_register">
    <div class="form__heading">Регистрация</div>
    <div class="form__field">
      <input type="text" name="name" id="name" class="form__name" placeholder="Имя" required />
    </div>
    <div class="form__field">
      <input type="text" name="email" id="email" class="form__email" placeholder="Почта" required />
    </div>
    <div class="form__field">
      <input type="password" name="password" id="password" class="form__password" minlength="8" placeholder="Пароль" required />
    </div>
    <input type="submit" value="${Button.Register}" class="form__submit">
    <div class="error-msg"></div>
  </form>
  <button class="button button__login">${Button.Login}</button>
  `,
    'registration'
  );

  const authorizationDivForm: HTMLDivElement = createDiv(
    `
  <form action="/" method="post" enctype="multipart/form-data" class="form form_login">
    <div class="form__heading">Авторизация</div>
    <div class="form__field">
      <input type="email" name="email" id="email" class="form__email" placeholder="Почта" required />
    </div>
    <div class="form__field">
      <input type="password" name="password" id="password" class="form__password" minlength="8" placeholder="Пароль" required />
    </div>
    <input type="submit" value="${Button.Login}" class="form__submit">
    <div class="error-msg"></div>
  </form>
  <button class="button button__register">${Button.Register}</button>
  `,
    'authorization'
  );

  const registrationForm = registrationDivForm.querySelector('.form') as HTMLFormElement;
  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // если авторизация успешна, отрисовать главную страницу
    const result = await register(registrationForm);
    if (result) {
      await drawPage(mainView);
    }
  });

  const authorizationForm = authorizationDivForm.querySelector('.form') as HTMLFormElement;
  authorizationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // если логин успешен, отрисовать главную страницу
    const result = await login(authorizationForm);
    if (result) {
      await drawPage(mainView);
    }
  });

  page.append(registrationDivForm);

  // кнопка "Войти" на странице регистрации
  const loginBtn = page.querySelector('.button__login') as HTMLButtonElement;
  loginBtn.addEventListener('click', () => {
    page.innerHTML = 'Authorization page';
    page.append(authorizationDivForm);

    // кнопка "Зарегистрироваться" на странице авторизации
    const registerButton = page.querySelector('.button__register') as HTMLButtonElement;
    registerButton.addEventListener('click', () => {
      page.innerHTML = 'Registration page';
      page.append(registrationDivForm);
    });
  });

  return page;
}
