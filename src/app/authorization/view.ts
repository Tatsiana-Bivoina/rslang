import { createDiv, createButton } from '../utils';
import { Button } from './abstracts';

export async function loginView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__authorization');
  page.innerHTML = 'Registration page';

  const registrationForm: HTMLDivElement = createDiv(
    `
  <form action="/profile" method="post" enctype="multipart/form-data" class="form">
    <div class="form__field">
      <label for="login">Логин: </label>
      <input type="text" name="login" id="login" required />
    </div>
    <div class="form__field">
      <label for="password">Пароль: </label>
      <input type="password" name="password" id="password" required />
    </div>
    <div class="form__field">
      <label for="image">Загрузить аватар</label>
      <input type="file" name="avatar" id="image" />
    </div>
    <input type="submit" value="${Button.Register}" class="form__submit">
  </form>
  <button class="button button__login">${Button.Login}</button>
  `,
    'registration'
  );

  const authorizationForm: HTMLDivElement = createDiv(
    `
  <form action="/profile" method="post" enctype="multipart/form-data" class="form">
    <div class="form__field">
      <label for="login">Логин: </label>
      <input type="text" name="login" id="login" required />
    </div>
    <div class="form__field">
      <label for="password">Пароль: </label>
      <input type="password" name="password" id="password" required />
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

  return page;
}
