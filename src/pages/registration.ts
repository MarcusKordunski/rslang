import create from "../utils/create";

class Registration {

  public emailInput!: HTMLInputElement;
  public passwordInput!: HTMLInputElement;
  public regButton!: HTMLElement;

  viewRegForm(): HTMLElement {
    const regContainer = create('div', 'reg');
    const regTitle = create('h2', 'reg__title', regContainer);
    regTitle.textContent = 'Регистрация';
    const regForm = create('form', 'reg__form', regContainer);
    const emailLabel = create('label', undefined, regForm, undefined, ['for', 'email']);
    emailLabel.textContent = 'Email:';
    this.emailInput = create('input', 'reg__email', regForm, undefined, ['type', 'email'], ['id', 'email']) as HTMLInputElement;
    const passwordLabel = create('label', undefined, regForm, undefined, ['for', 'password']);
    passwordLabel.textContent = 'Password:';
    this.passwordInput = create('input', 'reg__password', regForm, undefined, ['type', 'password'], ['id', 'password']) as HTMLInputElement;
    this.regButton = create('button', 'reg__reg-button', regForm);
    this.regButton.textContent = 'Зарегистрироваться';

    return regContainer;
  }
}