import { StartPage } from './start-page'

export class AudiocallPage {

  createPage(): void {
    const startPageHtml = new StartPage();
    startPageHtml.createGame();
  }
}