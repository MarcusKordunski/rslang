import create from '../utils/create';
import { api } from '../ts/api';
import { IWord } from '../types/types';

export class Sprint {

  public startButton!: HTMLElement;

  public mainContent = document.getElementById('main-content') as HTMLElement;

  private correctStreak: number;

  private isCorrect: boolean;

  private streakSignal1!: HTMLElement;

  private streakSignal2!: HTMLElement;

  private streakSignal3!: HTMLElement;

  private wordsArr!: IWord[];

  private wordsWrongArr!: IWord[];

  private index: number;

  public timer!: HTMLElement;

  public word!: HTMLElement;

  public translation!: HTMLElement;

  public correctBtn!: HTMLElement;

  public uncorrectBtn!: HTMLElement;

  public score!: HTMLElement;

  public scoreCount: number;

  public scoreAdd: number;

  public isTimeEnd!: boolean;

  public difficulty!: string;

  constructor() {
    this.isCorrect = true;
    this.correctStreak = 0;
    this.isTimeEnd = false;
    this.index = 0;
    this.scoreCount = 0;
    this.scoreAdd = 20;
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
      this.index = 0;
      this.correctStreak = 0;
      this.scoreCount = 0;
    });

    return sprintContainer;
  }

  renderSprintGame(): HTMLElement {
    const sprintContainer = create('div', 'sprint-game');
    this.score = create('p', 'sprint-game__score', sprintContainer);
    this.score.textContent = `Score: ${this.scoreCount}`;
    const streakContainer = create('div', 'sprint-game__streak', sprintContainer);
    this.streakSignal1 = create('div', 'streak__signal1', streakContainer);
    this.streakSignal2 = create('div', 'streak__signal2', streakContainer);
    this.streakSignal3 = create('div', 'streak__signal3', streakContainer);
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
      this.answerHandler('correct');
      this.streakHandler();
      this.index += 1;
      this.setNewWord();
    });
    this.uncorrectBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      this.answerHandler('uncorrect');
      this.streakHandler();
      this.index += 1;
      this.setNewWord();
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
    return Math.round(Math.random() * (29 - 0) + 0);
  }

  randomIndex(): number {
    return Math.round(Math.random() * (19 - 0) + 0);
  }


  async createWordsArr() {
    const page = this.randomPage();
    let wrongPage = this.randomPage();
    while (page === wrongPage) {
      wrongPage = this.randomPage();
    }
    this.wordsArr = await api.getWords(this.difficulty, page);
    this.wordsWrongArr = await api.getWords(this.difficulty, wrongPage);
    this.wordsArr.forEach((item) => {
      if (this.coinThrow()) {
        return item;
      } else {
        return item.wordTranslateWrong = this.wordsWrongArr[this.randomIndex()].wordTranslate;
      }
    });
  }

  setNewWord() {
    this.word.textContent = this.wordsArr[this.index].word;
    if (this.wordsArr[this.index].wordTranslateWrong) {
      this.translation.textContent = this.wordsArr[this.index].wordTranslateWrong as string;
    } else {
      this.translation.textContent = this.wordsArr[this.index].wordTranslate;
    }
  }

  answerHandler(correct: 'correct' | 'uncorrect') {
    if (correct === 'correct' && !this.wordsArr[this.index].wordTranslateWrong) {
      this.scoreCount += this.scoreAdd;
      this.score.textContent = `Score: ${this.scoreCount}`;
      this.correctStreak += 1;
    } else if (correct === 'uncorrect' && this.wordsArr[this.index].wordTranslateWrong) {
      this.scoreCount += this.scoreAdd;
      this.score.textContent = `Score: ${this.scoreCount}`;
      this.correctStreak += 1;
    } else {
      this.correctStreak = 0;
    }
  }

  streakHandler() {
    if (this.correctStreak === 1) {
      this.streakSignal1.classList.add('active');
    } else if (this.correctStreak === 2) {
      this.streakSignal2.classList.add('active');
    } else if (this.correctStreak >= 3) {
      this.streakSignal3.classList.add('active');
    } else if (this.correctStreak === 0) {
      this.streakSignal1.classList.remove('active');
      this.streakSignal2.classList.remove('active');
      this.streakSignal3.classList.remove('active');
    }
  }

}