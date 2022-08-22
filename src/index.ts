import './style.scss';
import { Sprint } from './pages/sprint';
import { View } from './ts/view';

const view = new View();
view.renderStartPage();

const sprintMenu = new Sprint();
sprintMenu.mainContent.appendChild(sprintMenu.renderSprintMenu());
