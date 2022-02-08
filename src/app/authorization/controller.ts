import { IUser } from './abstracts';
import { SERVER_URL } from '../abstracts';

export async function createUser(user: IUser): Promise<object> {
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
