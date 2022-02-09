import { IUser } from './abstracts';
import { SERVER_URL } from '../abstracts';

export async function createUser(form: HTMLFormElement): Promise<object> {
  const user = getUserData(form);
  console.log(`start creating user ${JSON.stringify(user)}`);
  const rawResponse = await fetch(`${SERVER_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  console.log(`rawResponse: ${rawResponse.status}`);
  const content = await rawResponse.json();
  return content;
}

function getUserData(form: HTMLFormElement) {
  const fd = new FormData(form);
  const user: IUser = {
    name: fd.get('login') as string,
    password: fd.get('password') as string,
    email: `${fd.get('login')}@mail.ru`
  };
  return user;
}
