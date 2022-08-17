import { IUserReg } from "../types/types";

class Api {

  readonly baseUrl: string = 'http://localhost:3000';
  readonly usersUrl: string = `${this.baseUrl}/users`;
  readonly loginUrl: string = `${this.baseUrl}/signin`

  async createUser(user: IUserReg) {
    const response = await fetch(`${this.usersUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();
    return data;
  }

  async loginUser(user: IUserReg) {
    const response = await fetch(`${this.loginUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();
    return data;
  }

}

export const api = new Api();