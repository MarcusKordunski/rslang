import './style.scss';
import { View } from './ts/view';
import { Header } from './components/header';
import { Main } from './pages/main';
import { Footer } from './components/footer';
import { Auth } from './pages/auth';
import { Textbook } from './pages/textbook/textbook';

export const auth = new Auth();
export const textbook = new Textbook();

export const view = new View(new Header(), new Main(), new Footer(), auth, textbook);
view.renderStartPage();

