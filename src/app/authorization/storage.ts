import { SERVER_URL } from '../abstracts';
import { IUserAuthResponse } from './abstracts';
import { Data } from './abstracts';

// прокси класс для работы с localStorage
export class UserData {
  public set token(v: string) {
    localStorage.setItem(Data.token, v);
    localStorage.setItem(Data.tokenCreationDate, String(Date.now()));
  }

  public async getToken(): Promise<string> {
    const tokenCreationDate = Number(localStorage.getItem(Data.tokenCreationDate));

    // если прошло менее 4 часов, вернём текущий токен, если более - сгенерим и вернём новый токен
    if (Date.now() - tokenCreationDate < 1000 * 60 * 60 * 4) return localStorage.getItem(Data.token) || '';

    const rawResponse = await fetch(`${SERVER_URL}${this.userId}/tokens`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${this.refreshToken}`,
        Accept: 'application/json'
      }
    });
    if (rawResponse.status !== 200) {
      // TODO raise logout function
      console.log(`Response status: ${rawResponse.status}`);
      return '';
    }
    const content: IUserAuthResponse = await rawResponse.json();
    this.saveData(content);
    return localStorage.getItem(Data.token) || '';
  }

  public set refreshToken(v: string) {
    localStorage.setItem(Data.refreshToken, v);
  }

  public get refreshToken(): string {
    return localStorage.getItem(Data.refreshToken) || '';
  }

  public set userId(v: string) {
    localStorage.setItem(Data.userId, v);
  }

  public get userId(): string {
    return localStorage.getItem(Data.userId) || '';
  }

  public set name(v: string) {
    localStorage.setItem(Data.name, v);
  }

  public get name(): string {
    return localStorage.getItem(Data.name) || '';
  }

  public saveData(rawData: IUserAuthResponse) {
    this.clear();
    this.token = rawData.token;
    this.refreshToken = rawData.refreshToken;
    this.userId = rawData.userId;
    this.name = rawData.name;
  }

  public clear() {
    localStorage.clear();
  }
}
