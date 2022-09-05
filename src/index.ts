import './style.scss';
import { View } from './ts/view';
import { Header } from './components/header';
import { Main } from './pages/main';
import { Footer } from './components/footer';
import { Auth } from './pages/auth';
import { Textbook } from './pages/textbook/textbook';
import { IAuth, IFooter, IHeader, IMain, ITextbook, IView } from './types/types';

export const auth: IAuth = new Auth();
export const textbook: ITextbook = new Textbook();
export const main: IMain = new Main();
export const header: IHeader = new Header();
export const footer: IFooter = new Footer();

export const view: IView = new View(header, main, footer, auth, textbook);
view.renderStartPage();

