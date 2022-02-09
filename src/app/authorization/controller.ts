import { IStatus, IUser, IUserResponse } from './abstracts';
import { SERVER_URL } from '../abstracts';

export async function createUser(form: HTMLFormElement): Promise<IUserResponse | IStatus> {
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

function getUserData(form: HTMLFormElement) {
  const fd = new FormData(form);
  const user: IUser = {
    name: fd.get('login') as string,
    password: fd.get('password') as string,
    email: `${fd.get('login')}@mail.ru`
  };
  return user;
}
