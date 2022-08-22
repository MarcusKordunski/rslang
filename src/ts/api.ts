import { IUserReg, IWord } from '../types/types';

class Api {

  readonly baseUrl: string = 'http://localhost:3000';

  readonly usersUrl: string = `${this.baseUrl}/users`;

  readonly loginUrl: string = `${this.baseUrl}/signin`;

  readonly words: string = `${this.baseUrl}/words`;

  async createUser(user: IUserReg) {
    const response = await fetch(`${this.usersUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
  }

  async loginUser(user: IUserReg) {
    const response = await fetch(`${this.loginUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
  }

  async getWord(id: string) {
    const response: Response = await fetch(`${this.words}/${id}`);
    return (await response.json()) as IWord;
  }

  async getWords(group: string, page: number) {
    const response: Response = await fetch(`${this.words}?group=${Number(group) - 1}&page=${page}`);
    return (await response.json()) as IWord[];
  }
}

export const api = new Api();