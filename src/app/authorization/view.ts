import { createDiv, createButton } from '../utils';
import { Button } from './abstracts';

export async function loginView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__authorization');
  page.innerHTML = `Authorization page`;

  const authorizationForm: HTMLDivElement = createDiv(
    `
  <form action="/profile" method="post" enctype="multipart/form-data">
    <input type="text" name="login" />
    <input type="password" name="password" />
  </form>
  `,
    'authorization'
  );

  const registrationForm: HTMLDivElement = createDiv(
    `
  <form action="/profile" method="post" enctype="multipart/form-data">
    <input type="text" name="login" />
    <input type="password" name="password" />
    <input type="file" name="avatar" />
  </form>
  `,
    'registration'
  );

  const loginButton: HTMLButtonElement = createButton(Button.Login, 'loginButton');
  const registerButton: HTMLButtonElement = createButton(Button.Register, 'registerButton');
  const logoutButton: HTMLButtonElement = createButton(Button.Logout, 'logoutButton');

  const forms = [registrationForm, authorizationForm];
  for (const form of forms) {
    form.append(loginButton);
    form.append(registerButton);
  }

  page.append(authorizationForm);

  return page;
}
