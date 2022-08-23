import {
  IHeader,
  IMain,
  IFooter,
} from "../types/types";
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Main } from '../pages/main';
import { Auth } from "../pages/auth";
import { Textbook } from "../pages/textbook/textbook";

export class View {
  private header: IHeader;
  private main: IMain;
  private footer: IFooter;
  private auth: Auth;
  private textbook: Textbook;
  constructor() {
    this.header = new Header();
    this.main = new Main();
    this.footer = new Footer();
    this.auth = new Auth();
    this.textbook = new Textbook();
  }


  public renderContainers(): void {
    let body = document.body;
    body.innerHTML = `
    <div class='root'>
      <header class='header'></header>
        <main class='main'>
          <div class='main-container container'></div>
        </main>
      <footer class='footer'></footer>
    </div>`

  }

  public renderStartPage(): void {
    this.renderContainers();
    this.renderHeader();
    this.renderMain();
    this.renderFooter();
    this.addHeaderListeners();
  }

  public renderHeader(): void {
    const header = document.querySelector('.header') as HTMLElement;
    header!.innerHTML = this.header.getHtml();
    const authPageBtn = document.querySelector('.header__auth-btn') as HTMLElement;
    if (this.auth.user) {
      authPageBtn.textContent = 'Выйти';
    } else {
      authPageBtn.textContent = 'Войти';
    }
  }

  public renderMain(): void {
    const main = document.querySelector('.main') as HTMLElement;
    main!.innerHTML = this.main.getHtml();
  }

  public renderFooter(): void {
    const footer = document.querySelector('.footer') as HTMLElement;
    footer!.innerHTML = this.footer.getHtml();
  }

  public addHeaderListeners(): void {
    const main = document.querySelector('.main-content') as HTMLElement;
    const authPageBtn = document.querySelector('.header__auth-btn') as HTMLElement;
    const textbookPageBtn = document.querySelector('.textbook-page') as HTMLElement;

    authPageBtn.addEventListener('click', () => {
      if (!this.auth.user) {
        main.innerHTML = '';
        main.append(this.auth.viewLoginForm());
      } else {
        this.auth.logoutUser();
      }
    });

    textbookPageBtn.addEventListener('click', () => {
      main.innerHTML = '';
      main.appendChild(this.textbook.init());
      this.textbook.initWords();
    })
  }
}

// export const view = new View();