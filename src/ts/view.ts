import {
  IHeader,
  IMain,
  IFooter,
  IAudiocallPage

} from "../types/types";
import { Auth } from "../pages/auth";
import { Textbook } from "../pages/textbook/textbook";
import { Sprint } from "../pages/sprint";
import { AudiocallPage } from "../games/audiocall/create-page";


export class View {
  private header: IHeader;
  private main: IMain;
  private footer: IFooter;
  private auth: Auth;
  private textbook: Textbook;
  private audiocall: IAudiocallPage;


  constructor(
    header: IHeader,
    main: IMain,
    footer: IFooter,
    auth: Auth,
    textbook: Textbook,
  ) {
    this.header = header;
    this.main = main;
    this.footer = footer;
    this.auth = auth;
    this.textbook = textbook;
    this.audiocall = new AudiocallPage();
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
    this.main.init();
    this.renderFooter();
    this.addHeaderListeners();
    this.renderAudiocall();
  }

  public renderHeader(): void {
    const header = document.querySelector('.header') as HTMLElement;
    header!.innerHTML = this.header.getHtml();
    const authPageBtn = document.querySelector('.header__auth-btn') as HTMLElement;
    const userName = document.querySelector('.header__user-name') as HTMLElement;
    if (this.auth.user) {
      authPageBtn.textContent = 'Выйти';
      userName.textContent = this.auth.user.name;
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
    const mainPageBtn = document.querySelector('.main-page') as HTMLElement;
    const authPageBtn = document.querySelector('.header__auth-btn') as HTMLElement;
    const textbookPageBtn = document.querySelector('.textbook-page') as HTMLElement;
    const sprintGameBtn = document.querySelector('.sprint-page') as HTMLElement;

    mainPageBtn.addEventListener('click', () => {
      main.innerHTML = '';
      this.main.init();
    })

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
    });

    sprintGameBtn.addEventListener('click', () => {
      main.innerHTML = '';
      const sprintMenu = new Sprint();
      sprintMenu.mainContent.appendChild(sprintMenu.renderSprintMenu());
      sprintMenu.arrowsListener();
    });
  }

  public renderAudiocall(): void {
    this.audiocall.createPage();
  }
}

