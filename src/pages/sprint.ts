import create from '../utils/create';
import { api } from '../ts/api';
import { IWord } from '../types/types';

export class Sprint {

  public startButton!: HTMLElement;

  public mainContent = document.getElementById('main-content') as HTMLElement;

  private correctStreak: number;

  private isCorrect: boolean;

  private wordsArr!: IWord[];

  private index: number;

  public timer!: HTMLElement;

  public word!: HTMLElement;

  public translation!: HTMLElement;

  public correctBtn!: HTMLElement;

  public uncorrectBtn!: HTMLElement;

  public score!: HTMLElement;

  public isTimeEnd!: boolean;

  public difficulty!: string;

  constructor() {
    this.isCorrect = true;
    this.correctStreak = 0;
    this.isTimeEnd = false;
    this.index = 0;
  }

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
    const sprintDifficulty = create('select', 'sprint-menu__difficulty', sprintButtons) as HTMLSelectElement;
    for (let i = 0; i < 6; i++) {
      const opt = create('option', undefined, sprintDifficulty, undefined, ['value', `${i + 1}`]);
      opt.textContent = `${i + 1}`;
    }
    this.startButton = create('button', 'sprint-menu__start', sprintButtons, undefined, ['type', 'button']);
    this.startButton.textContent = 'Начать';
    this.startButton.addEventListener('click', async (event) => {
      event.preventDefault();
      this.difficulty = sprintDifficulty.value;
      this.mainContent.innerHTML = '';
      this.mainContent.appendChild(this.renderSprintGame());
      await this.createWordsArr();
      this.timerCounter();
      this.setNewWord();
    });

    return sprintContainer;
  }

  renderSprintGame(): HTMLElement {
    const sprintContainer = create('div', 'sprint-game');
    this.score = create('p', 'sprint-game__score', sprintContainer);
    this.score.textContent = `Score: ${0}`;
    this.timer = create('p', 'sprint-game__timer', sprintContainer);
    this.timer.textContent = `${60}`;
    this.word = create('p', 'sprint-game__word', sprintContainer);
    this.translation = create('p', 'sprint-game__translation', sprintContainer);
    this.translation.textContent = ' ';
    const sprintButtons = create('div', 'sprint-game__buttons', sprintContainer);
    this.correctBtn = create('button', 'sprint-game__correct-btn', sprintButtons, undefined, ['type', 'button']);
    this.uncorrectBtn = create('button', 'sprint-game__uncorrect-btn', sprintButtons, undefined, ['type', 'button']);
    this.correctBtn.textContent = 'Верно';
    this.uncorrectBtn.textContent = 'Неверно';
    this.correctBtn.addEventListener('click', async (event) => {
      event.preventDefault();
    });
    this.uncorrectBtn.addEventListener('click', async (event) => {
      event.preventDefault();
    });

    return sprintContainer;
  }

  timerCounter() {
    this.isTimeEnd = false;
    let time = 60;
    const timer = setInterval(() => {
      time--;
      this.timer.textContent = `${time}`;
      if (time === 0) {
        clearInterval(timer);
        this.isTimeEnd = true;
      }
    }, 1000);
  }

  coinThrow(): boolean {
    return Math.random() < 0.5;
  }

  randomPage(): number {
    return Math.round(Math.random() * (30 - 0) + 0);
  }

  randomIndex(): number {
    return Math.round(Math.random() * (20 - 0) + 0);
  }


  async createWordsArr() {
    const page = this.randomPage();
    let wrongPage = this.randomPage();
    while (page === wrongPage) {
      wrongPage = this.randomPage();
    }
    this.wordsArr = await api.getWords(this.difficulty, page);
    const wordsWrongArr = await api.getWords(this.difficulty, wrongPage);
    this.wordsArr.forEach((item) => {
      if (this.coinThrow()) {
        return item;
      } else {
        return item.wordTranslateWrong = wordsWrongArr[this.randomIndex()].wordTranslate;
      }
    });
  }

  async setNewWord() {
    this.word.textContent = this.wordsArr[this.index].word;
    if (this.wordsArr[this.index].wordTranslateWrong && typeof this.translation.textContent === 'string' && typeof this.wordsArr[this.index].wordTranslateWrong === 'string') {
      this.translation.textContent = this.wordsArr[this.index].wordTranslateWrong;
    } else {
      this.translation.textContent = this.wordsArr[this.index].wordTranslate;
    }
  }
}