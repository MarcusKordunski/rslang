import create from "../utils/create";
import { api } from "../ts/api";
import { IUserObject, IUserReg } from "../types/types";
import { view } from "../";

export class Auth {
  public user!: IUserObject | null;
  public token!: string;

  constructor() {
    const user: string | null = localStorage.getItem('rs-lang-userInfo') || null;
    this.user = JSON.parse(user!);
    this.token = this.user!.token || '';
  }

  viewLoginForm(): HTMLElement {
    const loginContainer = create('div', 'login');
    const loginTitle = create('h2', 'login__title', loginContainer);
    loginTitle.textContent = 'Авторизация';
    const loginForm = create('form', 'login__form', loginContainer);
    const emailLabel = create('label', undefined, loginForm, undefined, ['for', 'email']);
    emailLabel.textContent = 'Email:';
    const emailInput = create('input', 'login__email', loginForm, undefined, ['type', 'email'], ['id', 'email']) as HTMLInputElement;
    const passwordLabel = create('label', undefined, loginForm, undefined, ['for', 'password']);
    passwordLabel.textContent = 'Password:';
    const passwordInput = create('input', 'login__password', loginForm, undefined, ['type', 'password'], ['id', 'password']) as HTMLInputElement;
    const loginButton = create('button', 'login__login-button', loginForm);
    loginButton.textContent = 'Войти';
    const regLink = create('a', 'login__link', loginForm, undefined, ['href', '#']);
    regLink.textContent = 'Страница регистрации';


    loginButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const user: IUserReg = { email: emailInput.value, password: passwordInput.value };
      await this.loginUser(user);
    });

    regLink.addEventListener('click', (event) => {
      event.preventDefault();
      const main = document.querySelector('.main-content') as HTMLElement;
      main.innerHTML = '';
      main.append(this.viewRegForm());
    })

    return loginContainer;
  }

  viewRegForm(): HTMLElement {
    const regContainer = create('div', 'reg');
    const regTitle = create('h2', 'reg__title', regContainer);
    regTitle.textContent = 'Регистрация';
    const regForm = create('form', 'reg__form', regContainer);
    const nameLabel = create('label', undefined, regForm, undefined, ['for', 'name']);
    nameLabel.textContent = 'Имя:';
    const nameInput = create('input', 'reg__name', regForm, undefined, ['type', 'text'], ['id', 'name']) as HTMLInputElement;
    const emailLabel = create('label', undefined, regForm, undefined, ['for', 'email']);
    emailLabel.textContent = 'Email:';
    const emailInput = create('input', 'reg__email', regForm, undefined, ['type', 'email'], ['id', 'email']) as HTMLInputElement;
    const passwordLabel = create('label', undefined, regForm, undefined, ['for', 'password']);
    passwordLabel.textContent = 'Password:';
    const passwordInput = create('input', 'reg__password', regForm, undefined, ['type', 'password'], ['id', 'password']) as HTMLInputElement;
    const regButton = create('button', 'reg__reg-button', regForm);
    regButton.textContent = 'Зарегистрироваться';
    const loginLink = create('a', 'reg__link', regForm, undefined, ['href', '#']);
    loginLink.textContent = 'Страница авторизации';

    regButton.addEventListener('click', async (event) => {
      event.preventDefault();
      await api.createUser({ email: emailInput.value, password: passwordInput.value });
    });

    loginLink.addEventListener('click', (event) => {
      event.preventDefault();
      const main = document.querySelector('.main-content') as HTMLElement;
      main.innerHTML = '';
      main.append(this.viewLoginForm());
    })

    return regContainer;
  }

  async loginUser(user: IUserReg): Promise<void> {
    try {
      const data = await api.loginUser(user);
      this.user = data;
      this.token = data.token;
      localStorage.setItem('rs-lang-userInfo', JSON.stringify(this.user));
      view.renderStartPage();
      const authBtn = document.querySelector('.header__auth-btn') as HTMLButtonElement;
      authBtn.textContent = 'Выйти';
    } catch {
      console.log('Неверный логин');
    }
  }

  logoutUser(): void {
    this.user = null;
    this.token = '';
    localStorage.removeItem('rs-lang-userInfo');
    view.renderStartPage();
    const authBtn = document.querySelector('.header__auth-btn') as HTMLButtonElement;
    authBtn.textContent = 'Войти';
  }

  showStatusMessage() {

  }
}