import create from '../utils/create';
import { api } from '../ts/api';

export class Sprint {

  public startButton!: HTMLElement;

  renderSprintMenu(): HTMLElement {
    const sprintContainer = create('div', 'sprint-menu');
    const sprintTitle = create('h2', 'sprint-menu__title', sprintContainer);
    sprintTitle.textContent = 'SPRINT';
    const sprintAbout = create('p', 'sprint-menu__about', sprintContainer);
    sprintAbout.textContent = '«Спринт» - это тренировка для повторения заученных слов из вашего словаря. Выберите сложность и начните упражняться в распознавании слов.';
    const sprintControls = create('ul', 'sprint-menu__controls', sprintContainer);
    const sprintControlsLi1 = create('li', 'sprint-menu__controls__li', sprintControls);
    const sprintControlsLi2 = create('li', 'sprint-menu__controls__li', sprintControls);
    sprintControlsLi1.textContent = 'Используйте мышь';
    sprintControlsLi2.textContent = 'Используйте клавиши влево/вправо';
    const sprintButtons = create('div', 'sprint-menu__buttons', sprintContainer);
    const sprintDifficulty = create('select', 'sprint-menu__difficulty', sprintButtons);
    for (let i = 0; i < 6; i++) {
      const opt = create('option', undefined, sprintDifficulty, undefined, ['value', `difficulty${i + 1}`]);
      opt.textContent = `${i + 1}`;
    }
    this.startButton = create('button', 'sprint-menu__start', sprintButtons, undefined, ['type', 'button']);
    this.startButton.textContent = 'Начать';
    this.startButton.addEventListener('click', async (event) => {
      event.preventDefault();
    });

    return sprintContainer;
  }
}