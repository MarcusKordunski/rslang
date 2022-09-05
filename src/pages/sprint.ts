import create from '../utils/create';
import { api } from '../ts/api';
import { IWord } from '../types/types';
import { auth, main } from '../index';

export class Sprint {

  public startButton!: HTMLElement;

  public mainContent = document.querySelector('.main-content') as HTMLElement;

  private correctStreak: number;

  private isCorrect: boolean;

  private streakSignal1!: HTMLElement;

  private streakSignal2!: HTMLElement;

  private streakSignal3!: HTMLElement;

  private wordsArr!: IWord[];

  private wordsWrongArr!: IWord[];

  private resCorrectArr: IWord[];

  private resUncorrectArr: IWord[];

  private timerInterval!: NodeJS.Timer;

  private index: number;

  private arrowBlock: boolean;

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

  public view!: string;

  public learnedWordsStat: number;

  public correctWordsStat: number;

  public uncorrectWordsStat: number;

  public newWordsStat: number;

  public maxStreak: number;

  constructor() {
    this.isCorrect = true;
    this.correctStreak = 0;
    this.isTimeEnd = false;
    this.arrowBlock = false;
    this.index = 0;
    this.scoreCount = 0;
    this.scoreAdd = 20;
    this.resCorrectArr = [];
    this.resUncorrectArr = [];
    this.learnedWordsStat = 0;
    this.correctWordsStat = 0;
    this.uncorrectWordsStat = 0;
    this.newWordsStat = 0;
    this.maxStreak = 0;
  }

  renderSprintMenu(): HTMLElement {
    this.view = 'menu';
    const sprintContainer = create('div', 'sprint-menu');
    const sprintTitle = create('h2', 'sprint-menu__title', sprintContainer);
    sprintTitle.textContent = 'SPRINT';
    const sprintAbout = create('p', 'sprint-menu__about', sprintContainer);
    sprintAbout.textContent = '«Спринт» - это тренировка для повторения заученных слов из вашего словаря. Выберите сложность и начните упражняться в распознавании слов. \n\n При трёх правильных ответах подряд, количество получаемых очков увеличивается в два раза.';
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
      this.resCorrectArr = [];
      this.resUncorrectArr = [];
      this.index = 0;
      this.correctStreak = 0;
      this.scoreCount = 0;
      this.learnedWordsStat = 0;
      this.newWordsStat = 0;
      this.correctWordsStat = 0;
      this.uncorrectWordsStat = 0;
      this.maxStreak = 0;
      this.mainContent.innerHTML = '';
      this.mainContent.appendChild(this.renderSprintGame());
      clearInterval(this.timerInterval);
      await this.createWordsArr();
      this.timerCounter();
      this.setNewWord();
    });

    return sprintContainer;
  }

  renderSprintGame(): HTMLElement {
    this.view = 'game';
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
      await this.answerHandler('correct');
      this.streakHandler();
      this.index += 1;
      this.setNewWord();
    });
    this.uncorrectBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      await this.answerHandler('uncorrect');
      this.streakHandler();
      this.index += 1;
      this.setNewWord();
    });

    return sprintContainer;
  }

  renderSprintResult(): HTMLElement {
    this.view = 'res';
    const sprintContainer = create('div', 'sprint-result');
    const resultTitle = create('p', 'sprint-result__title', sprintContainer);
    resultTitle.textContent = 'Ваш результат:';
    const correctTitle = create('p', 'sprint-result__correct-title', sprintContainer);
    correctTitle.textContent = `ВЕРНО: ${this.resCorrectArr.length}`;
    const correctWords = create('div', 'sprint-result__correct-words', sprintContainer);
    for (let i = 0; i < this.resCorrectArr.length; i++) {
      const sound = create('span', undefined, correctWords);
      const word = create('p', undefined, correctWords);
      create('br', undefined, correctWords);
      create('br', undefined, correctWords);
      sound.textContent = '🎧';
      word.textContent = `${this.resCorrectArr[i].word} - ${this.resCorrectArr[i].wordTranslate}`;
      sound.addEventListener('click', async () => {
        const audio = new Audio(`https://rs-lang-learnsword.herokuapp.com/${this.resCorrectArr[i].audio}`);
        audio.play();
      });
    }
    const uncorrectTitle = create('p', 'sprint-result__uncorrect-title', sprintContainer);
    uncorrectTitle.textContent = `ОШИБОК: ${this.resUncorrectArr.length}`;
    const uncorrectWords = create('div', 'sprint-result__uncorrect-words', sprintContainer);
    for (let i = 0; i < this.resUncorrectArr.length; i++) {
      const sound = create('span', undefined, uncorrectWords);
      const word = create('p', undefined, uncorrectWords);
      create('br', undefined, uncorrectWords);
      create('br', undefined, uncorrectWords);
      sound.textContent = '🎧';
      word.textContent = `${this.resUncorrectArr[i].word} - ${this.resUncorrectArr[i].wordTranslate}`;
      sound.addEventListener('click', async () => {
        const audio = new Audio(`https://rs-lang-learnsword.herokuapp.com/${this.resUncorrectArr[i].audio}`);
        audio.play();
      });
    }
    const resultButtons = create('div', 'sprint-result__buttons', sprintContainer);
    const playAgain = create('button', 'sprint-result__play-again', resultButtons, undefined, ['type', 'button']);
    const exit = create('button', 'sprint-result__exit', resultButtons, undefined, ['type', 'button']);
    playAgain.textContent = 'Играть еще';
    exit.textContent = 'Выйти';
    playAgain.addEventListener('click', async (event) => {
      event.preventDefault();
      this.mainContent.innerHTML = '';
      this.mainContent.appendChild(this.renderSprintMenu());
    });
    exit.addEventListener('click', async (event) => {
      event.preventDefault();
      this.mainContent.innerHTML = '';
      this.mainContent.appendChild(main.init());
    });
    return sprintContainer;
  }

  timerCounter() {
    this.isTimeEnd = false;
    let time = 60;
    this.timerInterval = setInterval(() => {
      time--;
      this.timer.textContent = `${time}`;
      if (time === 0) {
        clearInterval(this.timerInterval);
        this.updateSprintStats();
        this.isTimeEnd = true;
        this.mainContent.innerHTML = '';
        this.mainContent.appendChild(this.renderSprintResult());
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


  async createWordsArr(pageParam?: number) {
    let page: number;
    if (pageParam === undefined) {
      page = this.randomPage();
    } else {
      page = pageParam;
    }
    let wrongPage = this.randomPage();
    while (page === wrongPage) {
      wrongPage = this.randomPage();
    }
    const filter = { '$and': [{ '$or': [{ 'userWord.difficulty': 'hard' }, { 'userWord.difficulty': 'normal' }, { 'userWord': null }] }, { '$and': [{ 'group': Number(this.difficulty) - 1 }, { 'page': page }] }] };
    const wrongFilter = { '$and': [{ '$or': [{ 'userWord.difficulty': 'hard' }, { 'userWord.difficulty': 'normal' }, { 'userWord': null }] }, { '$and': [{ 'group': Number(this.difficulty) - 1 }, { 'page': wrongPage }] }] };
    if ((pageParam === undefined || !auth.user?.userId) && Number(this.difficulty) < 7) {
      this.wordsArr = await api.getWordsSprint(this.difficulty, page);
      this.wordsWrongArr = await api.getWordsSprint(this.difficulty, wrongPage);
    } else if (Number(this.difficulty) === 7 && auth.user?.userId) {
      this.wordsArr = await api.getAggregatedWords(auth.user?.userId, auth.token, JSON.stringify({ 'userWord.difficulty': 'hard' }));
      this.wordsWrongArr = await api.getWordsSprint('5', wrongPage);
    } else if (auth.user?.userId) {
      this.wordsArr = await api.getAggregatedWords(auth.user?.userId, auth.token, JSON.stringify(filter));
      this.wordsWrongArr = await api.getAggregatedWords(auth.user?.userId, auth.token, JSON.stringify(wrongFilter));
    }

    this.wordsArr.forEach((item) => {
      if (this.coinThrow()) {
        return item;
      } else {
        return item.wordTranslateWrong = this.wordsWrongArr[this.randomIndex()].wordTranslate;
      }
    });
  }

  async setNewWord() {
    if (this.index === this.wordsArr.length) {
      this.updateSprintStats();
      this.mainContent.innerHTML = '';
      this.mainContent.appendChild(this.renderSprintResult());
      clearInterval(this.timerInterval);
    } else {
      this.word.textContent = this.wordsArr[this.index].word;
      if (this.wordsArr[this.index].wordTranslateWrong) {
        this.translation.textContent = this.wordsArr[this.index].wordTranslateWrong as string;
      } else {
        this.translation.textContent = this.wordsArr[this.index].wordTranslate;
      }
    }
  }

  blockGameButtons() {
    this.correctBtn.setAttribute('disabled', 'disabled');
    this.uncorrectBtn.setAttribute('disabled', 'disabled');
    this.arrowBlock = true;
  }

  unlockGameButtons() {
    this.correctBtn.removeAttribute('disabled');
    this.uncorrectBtn.removeAttribute('disabled');
    this.arrowBlock = false;
  }

  async answerHandler(correct: 'correct' | 'uncorrect') {
    let id = this.wordsArr[this.index].id;
    if (this.wordsArr[this.index].id === undefined) {
      id = this.wordsArr[this.index]._id as string;
    }
    if (correct === 'correct' && !this.wordsArr[this.index].wordTranslateWrong) {
      this.scoreCount += this.scoreAdd;
      this.score.textContent = `Score: ${this.scoreCount}`;
      this.correctStreak += 1;
      this.resCorrectArr.push(this.wordsArr[this.index]);
      if (auth.user?.userId) {
        this.correctWordsStat++;
        this.blockGameButtons();
        const body = await api.getUserWord(auth.user?.userId, auth.token, id);
        if (body.difficulty === 'normal' && body.difficulty === 'normal' && body.optional.correctCount === 0 && body.optional.totalIncorrectCount === 0 && body.optional.totalCorrectCount === 0) {
          await api.createUserWord(auth.user?.userId, id, auth.token, { difficulty: 'normal', optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
          this.newWordsStat++;
        } else if (body.optional.correctCount === 2) {
          this.learnedWordsStat++;
          await api.updateUserWord(auth.user?.userId, auth.token, id, { difficulty: 'easy', optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
        } else if (body.optional.correctCount === 4 && body.difficulty === 'hard') {
          this.learnedWordsStat++;
          await api.updateUserWord(auth.user?.userId, auth.token, id, { difficulty: 'easy', optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
        } else {
          await api.updateUserWord(auth.user?.userId, auth.token, id, { difficulty: body.difficulty, optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
        }
        this.unlockGameButtons();
      }
    } else if (correct === 'uncorrect' && this.wordsArr[this.index].wordTranslateWrong) {
      this.scoreCount += this.scoreAdd;
      this.score.textContent = `Score: ${this.scoreCount}`;
      this.correctStreak += 1;
      this.resCorrectArr.push(this.wordsArr[this.index]);
      if (auth.user?.userId) {
        this.correctWordsStat++;
        this.blockGameButtons();
        const body = await api.getUserWord(auth.user?.userId, auth.token, id);
        if (body.difficulty === 'normal' && body.difficulty === 'normal' && body.optional.correctCount === 0 && body.optional.totalIncorrectCount === 0 && body.optional.totalCorrectCount === 0) {
          await api.createUserWord(auth.user?.userId, id, auth.token, { difficulty: 'normal', optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
          this.newWordsStat++;
        } else if (body.optional.correctCount === 2 && body.difficulty === 'normal') {
          this.learnedWordsStat++;
          await api.updateUserWord(auth.user?.userId, auth.token, id, { difficulty: 'easy', optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
        } else if (body.optional.correctCount === 4 && body.difficulty === 'hard') {
          this.learnedWordsStat++;
          await api.updateUserWord(auth.user?.userId, auth.token, id, { difficulty: 'easy', optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
        } else {
          await api.updateUserWord(auth.user?.userId, auth.token, id, { difficulty: body.difficulty, optional: { correctCount: body.optional.correctCount + 1, totalCorrectCount: body.optional.totalCorrectCount + 1, totalIncorrectCount: body.optional.totalIncorrectCount } });
        }
        this.unlockGameButtons();
      }
    } else {
      this.correctStreak = 0;
      this.resUncorrectArr.push(this.wordsArr[this.index]);
      if (auth.user?.userId) {
        this.uncorrectWordsStat++;
        this.blockGameButtons();
        const body = await api.getUserWord(auth.user?.userId, auth.token, id);
        if (body.difficulty === 'normal' && body.difficulty === 'normal' && body.optional.correctCount === 0 && body.optional.totalIncorrectCount === 0 && body.optional.totalCorrectCount === 0) {
          await api.createUserWord(auth.user?.userId, id, auth.token, { difficulty: 'normal', optional: { correctCount: 0, totalCorrectCount: body.optional.totalCorrectCount, totalIncorrectCount: body.optional.totalIncorrectCount + 1 } });
          this.newWordsStat++;
        } else {
          await api.updateUserWord(auth.user?.userId, auth.token, id, { difficulty: body.difficulty, optional: { correctCount: 0, totalCorrectCount: body.optional.totalCorrectCount, totalIncorrectCount: body.optional.totalIncorrectCount + 1 } });
        }
        this.unlockGameButtons();
      }
    }
  }

  streakHandler() {
    this.createMaxStreak();
    if (this.correctStreak % 3 === 1) {
      this.streakSignal1.classList.add('active');
      this.streakSignal2.classList.remove('active');
      this.streakSignal3.classList.remove('active');
    } else if (this.correctStreak % 3 === 2) {
      this.streakSignal2.classList.add('active');
    } else if (this.correctStreak % 3 === 0 && this.correctStreak > 0) {
      this.streakSignal3.classList.add('active');
    } else if (this.correctStreak === 0) {
      this.streakSignal1.classList.remove('active');
      this.streakSignal2.classList.remove('active');
      this.streakSignal3.classList.remove('active');
    }
    this.scoreAdd = 20 + (20 * Math.round(this.correctStreak / 3));
  }

  createMaxStreak() {
    if (this.maxStreak < this.correctStreak) {
      this.maxStreak = this.correctStreak;
    }
  }

  arrowsListener() {
    document.addEventListener('keydown', async (event) => {
      if (event.code === 'ArrowLeft' && this.view === 'game' && event.repeat === false && this.arrowBlock === false) {
        this.arrowBlock = true;
        event.preventDefault();
        await this.answerHandler('correct');
        this.streakHandler();
        this.index += 1;
        this.setNewWord();
      } else if (event.code === 'ArrowRight' && this.view === 'game' && event.repeat === false && this.arrowBlock === false) {
        this.arrowBlock = true;
        event.preventDefault();
        await this.answerHandler('uncorrect');
        this.streakHandler();
        this.index += 1;
        this.setNewWord();
      }
    });
  }


  eventListenerTextbook() {
    const btn = document.querySelector('.textbook-games__sprint') as HTMLElement;
    btn.addEventListener('click', async () => {
      this.mainContent = document.querySelector('.main-content') as HTMLElement;
      this.difficulty = String(1 + Number(localStorage.getItem('rs-lang-active-group'))) as string;
      this.resCorrectArr = [];
      this.resUncorrectArr = [];
      this.index = 0;
      this.correctStreak = 0;
      this.scoreCount = 0;
      this.learnedWordsStat = 0;
      this.newWordsStat = 0;
      this.correctWordsStat = 0;
      this.uncorrectWordsStat = 0;
      this.maxStreak = 0;
      this.mainContent.innerHTML = '';
      await this.createWordsArr(Number(localStorage.getItem('rs-lang-active-page')));
      this.mainContent.appendChild(this.renderSprintGame());
      clearInterval(this.timerInterval);
      this.timerCounter();
      this.setNewWord();
    }, { once: true });
  }

  async updateSprintStats() {
    if (auth.user?.userId) {
      const currStats = await api.getStatistics(auth.user.userId, auth.token);
      if (currStats === null) {
        await api.updateStatistics(auth.user.userId, auth.token,
          {
            learnedWords: this.learnedWordsStat,
            optional: {
              audiocall: {
                correctWords: 0,
                incorrectWords: 0,
                streak: 0,
                newWords: 0,
              },
              sprint: {
                correctWords: this.correctWordsStat,
                incorrectWords: this.uncorrectWordsStat,
                streak: this.maxStreak,
                newWords: this.newWordsStat,
              },
            },
          });
      } else if (currStats.learnedWords !== undefined) {
        await api.updateStatistics(auth.user.userId, auth.token, {
          learnedWords: currStats.learnedWords + this.learnedWordsStat,
          optional: {
            audiocall: {
              correctWords: currStats.optional.audiocall.correctWords,
              incorrectWords: currStats.optional.audiocall.incorrectWords,
              streak: currStats.optional.audiocall.streak,
              newWords: currStats.optional.audiocall.newWords,
            },
            sprint: {
              correctWords: currStats.optional.sprint.correctWords + this.correctWordsStat,
              incorrectWords: currStats.optional.sprint.incorrectWords + this.uncorrectWordsStat,
              streak: currStats.optional.sprint.streak > this.maxStreak ? currStats.optional.sprint.streak : this.maxStreak,
              newWords: currStats.optional.sprint.newWords + this.newWordsStat,
            },
          },
        });
      }
    }
  }
}