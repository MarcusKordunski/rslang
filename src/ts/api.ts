import { IUserReg, IUserWord } from "../types/types";
import { auth } from "..";


class Api {

  readonly baseUrl: string = 'http://localhost:3000';
  readonly usersUrl: string = `${this.baseUrl}/users`;
  readonly loginUrl: string = `${this.baseUrl}/signin`;
  readonly wordsUrl: string = `${this.baseUrl}/words`;

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

  async getUser(userId: string, token: string) {
    const response = await fetch(`${this.usersUrl}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  }

  async getWords(group: number, page: number) {
    const response = await fetch(`${this.wordsUrl}?group=${group}&page=${page}`);
    const data = await response.json();
    return data;
  }

  async createUserWord(userId: string, wordId: string, token: string, body: IUserWord) {
    const response = await fetch(`${this.usersUrl}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return data;
  }

  async getUserWords(userId: string, token: string) {
    const response = await fetch(`${this.usersUrl}/${userId}/words`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }

  async getUserWord(userId: string, token: string, wordId: string) {
    const response = await fetch(`${this.usersUrl}/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }

  async updateUserWord(userId: string, token: string, wordId: string, body: IUserWord) {
    const response = await fetch(`${this.usersUrl}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return data;
  }

  async deleteUserWord(userId: string, token: string, wordId: string) {
    const response = await fetch(`${this.usersUrl}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }

  async getAggregatedWords(userId: string, token: string, filter: string, wordsPerPage: number = 20,) {
    const response = await fetch(`${this.usersUrl}/${userId}/aggregatedWords?wordsPerPage=${wordsPerPage}&filter=${filter}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data[0].paginatedResults;
  }

}

export const api = new Api();