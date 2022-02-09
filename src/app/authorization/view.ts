import { createDiv, createButton } from '../utils';
import { Button, IUser } from './abstracts';
import { createUser } from './controller';

export async function loginView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__authorization');
  page.innerHTML = 'Registration page';

  const registrationForm: HTMLDivElement = createDiv(
    `
  <form action="/" method="post" enctype="multipart/form-data" class="form">
    <div class="form__field">
      <label for="login">Логин: </label>
      <input type="text" name="login" id="login" class="form__login" required />
    </div>
    <div class="form__field">
      <label for="password">Пароль: </label>
      <input type="password" name="password" id="password" class="form__password" minlength="8" required />
    </div>
    <input type="submit" value="${Button.Register}" class="form__submit">
  </form>
  <button class="button button__login">${Button.Login}</button>
  `,
    'registration'
  );

  const authorizationForm: HTMLDivElement = createDiv(
    `
  <form action="/" method="post" enctype="multipart/form-data" class="form">
    <div class="form__field">
      <label for="login">Логин: </label>
      <input type="text" name="login" id="login" class="form__login" required />
    </div>
    <div class="form__field">
      <label for="password">Пароль: </label>
      <input type="password" name="password" id="password" class="form__password" minlength="8" required />
    </div>
    <input type="submit" value="${Button.Login}" class="form__submit">
  </form>
  <button class="button button__register">${Button.Register}</button>
  `,
    'authorization'
  );

  page.append(registrationForm);

  // кнопка "Войти" на странице регистрации
  const loginBtn = page.querySelector('.button__login') as HTMLButtonElement;
  loginBtn.addEventListener('click', () => {
    page.innerHTML = 'Authorization page';
    page.append(authorizationForm);

    // кнопка "Зарегистрироваться" на странице авторизации
    const registerButton = page.querySelector('.button__register') as HTMLButtonElement;
    registerButton.addEventListener('click', () => {
      page.innerHTML = 'Registration page';
      page.append(registrationForm);
    });
  });

  const form = page.querySelector('.form') as HTMLFormElement;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await createUser(form);
  });

  return page;
}
