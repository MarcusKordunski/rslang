import {
  IHeader,
  IMain,
  IFooter,
  INavigation,
} from "../types/types";
import { Footer } from '../components/footer';
import { Navigation } from '../components/navigation';
import { Header } from '../components/header';
import { Main } from '../pages/main';
import { Auth } from "../pages/auth";
import { Textbook } from "../pages/textbook/textbook";

export class View {
  private header: IHeader;
  private navigation: INavigation;
  private main: IMain;
  private footer: IFooter;
  private auth: Auth;
  private textbook: Textbook;
  constructor() {
    this.header = new Header();
    this.navigation = new Navigation();
    this.main = new Main();
    this.footer = new Footer();
    this.auth = new Auth();
    this.textbook = new Textbook();
  }


  public renderContainers(): void {
    let body = document.body;
    body.innerHTML = `
    <div id='root'>
      <header id='header'></header>
        <main id='container'>
          <nav id='nav'></nav>
          <section id='main'></section>
        </main>
      <footer id='footer'></footer>
    </div>`

  }

  public renderStartPage(): void {
    this.renderContainers();
    this.renderHeader();
    this.renderNav();
    this.renderMain();
    this.addHeaderListeners();
  }

  public renderHeader(): void {
    const header: HTMLElement | null = document.querySelector('#header');
    header!.innerHTML = this.header.getHtml();
  }

  public renderNav(): void {
    const nav: HTMLElement | null = document.querySelector('#nav');
    nav!.innerHTML = this.navigation.getHtml();
  }

  public renderMain(): void {
    const main: HTMLElement | null = document.querySelector('#main');
    main!.innerHTML = this.main.getHtml();
  }

  public renderFooter(): void {
    const footer: HTMLElement | null = document.querySelector('#footer');
    footer!.innerHTML = this.footer.getHtml();
  }

  public addHeaderListeners(): void {
    const main = document.querySelector('#main') as HTMLElement;
    const authPageBtn = document.querySelector('#auth-icon') as HTMLElement;
    const textbookPageBtn = document.querySelector('#textbook-page') as HTMLElement;

    authPageBtn.addEventListener('click', () => {
      main.innerHTML = '';
      main.append(this.auth.viewLoginForm());
    });

    textbookPageBtn.addEventListener('click', () => {
      main.innerHTML = '';
      main.appendChild(this.textbook.init());
      this.textbook.initWords();
    })
  }
}