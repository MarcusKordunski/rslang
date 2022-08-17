import create from "../utils/create";
import { api } from "../ts/api";

export class Login {

  public emailInput!: HTMLInputElement;
  public passwordInput!: HTMLInputElement;
  public logButton!: HTMLElement;

  viewLogForm(): HTMLElement {
    const logContainer = create('div', 'log');
    const logTitle = create('h2', 'log__title', logContainer);
    logTitle.textContent = 'Авторизация';
    const logForm = create('form', 'log__form', logContainer);
    const emailLabel = create('label', undefined, logForm, undefined, ['for', 'email']);
    emailLabel.textContent = 'Email:';
    this.emailInput = create('input', 'log__email', logForm, undefined, ['type', 'email'], ['id', 'email']) as HTMLInputElement;
    const passwordLabel = create('label', undefined, logForm, undefined, ['for', 'password']);
    passwordLabel.textContent = 'Password:';
    this.passwordInput = create('input', 'log__password', logForm, undefined, ['type', 'password'], ['id', 'password']) as HTMLInputElement;
    this.logButton = create('button', 'log__log-button', logForm);
    this.logButton.textContent = 'Войти';

    this.logButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const data = await api.loginUser({ email: this.emailInput.value, password: this.passwordInput.value });
    });

    return logContainer;
  }
}