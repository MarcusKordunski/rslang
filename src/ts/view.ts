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
    main.innerHTML = this.main.getHtml();
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    mainContent.appendChild(this.main.init());
  }

  public renderFooter(): void {
    const footer = document.querySelector('.footer') as HTMLElement;
    footer!.innerHTML = this.footer.getHtml();
  }

  public addHeaderListeners(): void {
    const main = document.querySelector('.main-content') as HTMLElement;
    const mainPageBtn = document.querySelectorAll('.main-page') as NodeList;
    const authPageBtn = document.querySelector('.header__auth-btn') as HTMLElement;
    const sprint = new Sprint();
    sprint.arrowsListener();

    const textbookPageBtn = document.querySelectorAll('.textbook-page') as NodeList;
    const sprintGameBtn = document.querySelectorAll('.sprint-page') as NodeList;
    const burger = document.querySelector('.burger') as HTMLElement;
    const burgerMenu = document.querySelector('.burger-menu') as HTMLElement;

    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      burgerMenu.classList.toggle('open');
    });

    mainPageBtn.forEach((item) => {
      item.addEventListener('click', () => {
        main.innerHTML = '';
        main.appendChild(this.main.init());
        if (burgerMenu.classList.contains('open')) {
          burger.classList.remove('open');
          burgerMenu.classList.remove('open')
        };
      })
    });

    authPageBtn.addEventListener('click', () => {
      if (!this.auth.user) {
        main.innerHTML = '';
        main.append(this.auth.viewLoginForm());
      } else {
        this.auth.logoutUser();
      }
    });

    textbookPageBtn.forEach((item) => {
      item.addEventListener('click', () => {
        main.innerHTML = '';
        main.appendChild(this.textbook.init());
        sprint.eventListenerTextbook();
        if (burgerMenu.classList.contains('open')) {
          burger.classList.remove('open');
          burgerMenu.classList.remove('open')
        };
      });
    })

    sprintGameBtn.forEach((item) => {
      item.addEventListener('click', () => {
        main.innerHTML = '';
        const sprintMenu = new Sprint();
        sprintMenu.mainContent.appendChild(sprintMenu.renderSprintMenu());
        sprintMenu.arrowsListener();
        if (burgerMenu.classList.contains('open')) {
          burger.classList.remove('open');
          burgerMenu.classList.remove('open')
        };
      });
    });

  }

  public renderAudiocall(): void {
    this.audiocall.createPage();
  }
}

