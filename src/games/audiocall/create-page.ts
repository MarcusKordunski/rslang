import { StartPage } from './start-page';

export class AudiocallPage {

  createPage(): void {
    const startPageHtml = new StartPage();
    startPageHtml.createNavVersion();
  }

  createBookGame(): void {
    const startPageHtml = new StartPage();
    startPageHtml.createBookVersion();
  }

}