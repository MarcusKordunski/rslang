import {
  IHeader,
  IMain,
  IFooter,
  INavigation,
  IAudiocallPage
} from "../types/types";
import { Footer } from '../components/footer';
import { Navigation } from '../components/navigation';
import { Header } from '../components/header';
import { Main } from '../pages/main';
import { Auth } from "../pages/auth";
import { AudiocallPage } from "../games/audiocall/page";

export class View {
  private header: IHeader;
  private navigation: INavigation;
  private main: IMain;
  private footer: IFooter;
  private auth: Auth;
  private audiocall: IAudiocallPage;
  constructor() {
    this.header = new Header();
    this.navigation = new Navigation();
    this.main = new Main();
    this.footer = new Footer();
    this.auth = new Auth();
    this.audiocall = new AudiocallPage();
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
    this.renderAudiocall();
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
    const authButton = document.querySelector('#auth-icon') as HTMLElement;
    const main = document.querySelector('#main') as HTMLElement;
    authButton.addEventListener('click', () => {
      main.innerHTML = '';
      main.append(this.auth.viewLoginForm());
    });
  }

  public renderAudiocall(): void {
    const audiocallBtn: HTMLElement | null = document.querySelector('.audiocall');
    const main = document.querySelector('#main') as HTMLElement;
    
    audiocallBtn?.addEventListener('click', () => {
      main.innerHTML = this.audiocall.getHtml();
      const lvlList = document.querySelector('.levels-list') as HTMLElement;
      lvlList?.addEventListener('click', (e: Event) => {
        if (((e.target) as HTMLElement).closest('.levels-list-item')) {
          console.log(1)
        }
      });
    });
    
   
  }
}