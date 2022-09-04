import { api } from "../../ts/api";
import { IWord, IStatisticsObj } from "../../types/types";
import { auth } from "../..";

export class StartPage {

  wordNumber: number;

  correctAnswers: number;

  errors: number;

  endPageContent: string;

  answerStatuses: Array<string>;

  newWords: number;

  learnsWord: number;


  constructor() {
    this.wordNumber = 0;
    this.correctAnswers = 0;
    this.errors = 0;
    this.endPageContent = '';
    this.answerStatuses = [];
    this.newWords = 0;
    this.learnsWord = 0;
  }

  createNavVersion(): void {
    const audiocallBtns: NodeList | null = document.querySelectorAll('.audio-page');
    const audiocallBtn = audiocallBtns[1];
    const main = document.querySelector('.main-content') as HTMLElement;
    audiocallBtn?.addEventListener('click', async () => {
      main.innerHTML = this.getHtml();
      const lvlListItems: NodeList = document.querySelectorAll('.levels-list-item');
      this.lvlListItemslistener(lvlListItems);
      if (auth.user) {
        if (Date.now() - Number(localStorage.getItem('date')) > 86400000000) {
          await api.updateStatistics(auth.user!.userId, auth.token, {
            learnedWords: 0,
            optional: {
              audiocall: {
                correctWords: 0,
                incorrectWords: 0,
                streak: 0,
                newWords: 0,
              },
              sprint: {
                correctWords: 0,
                incorrectWords: 0,
                streak: 0,
                newWords: 0,
              },
            },
          });
          localStorage.setItem('date', String(Date.now()))
        }
      }
    });
  }

  async createBookVersion(): Promise<void> {
    this.resetCounters();
    const section = Number(localStorage.getItem('rs-lang-active-group'));
    const currentPage = Number(localStorage.getItem('rs-lang-active-page'));
    // запрос на создание с учебника
    let wordsArr;
    if (auth.user) {
      const getUsersWords: any = async function (page: number, array: any[]) {
        let pageNum = page;
        let filter = `%7B%22$and%22%3A%5B%7B%22group%22%3A${section}%7D%2C%7B%22page%22%3A${page}%7D%5D%7D`;
        if (section === 6) {
          filter = '%7B%22userWord.difficulty%22%3A%22hard%22%7D';
        }
        wordsArr = await api.getAggregatedWords(auth.user!.userId, auth.user!.token, filter);
        let filterWordsArr = wordsArr.filter((word: IWord) => word.userWord?.difficulty !== 'easy');
        let arr: any[] = array;
        if (arr.length === 20 || page === 0) {
          for (let i = 0; i < filterWordsArr.length; i++) {
            if (arr.length < 20) {
              arr.push(filterWordsArr[i]);
            }
          }
          wordsArr = arr;
        } else {
          for (let i = 0; i < filterWordsArr.length; i++) {
            if (arr.length < 20) {
              arr.push(filterWordsArr[i]);
            }
          }
          pageNum = pageNum - 1;
          return await getUsersWords(pageNum, arr);
        }
      }
      await getUsersWords(currentPage, []);

    }
    else { wordsArr = await api.getWords(section, currentPage) };
    this.getGamePage();
    const scrollBtn: HTMLElement | null = document.querySelector('.scroll-btn');
    await this.getNewPage(wordsArr, this.wordNumber);
    const variantBtns: NodeList = document.querySelectorAll('.options-list-item');
    this.scrollBtnListener(wordsArr, variantBtns, true);
    this.variantsBtnsClickListener(variantBtns, wordsArr, scrollBtn);
    this.variantsBtnsKeyListener(variantBtns, wordsArr, scrollBtn);
  }

  getHtml(): string {
    return `
      <div class='audiocall-content'>
        <div class='audiocall-menu-box'>
          <h2 class='audiocall-title'>Аудиовызов</h2>
          <p class='game-desciption'>Аудивызов - игра на тренировку навыков аудирования. В процессе игры десять попыток угадать слово, произнесенное на английском языке.</p>
          <ul class='game-rules'>
            <li class='game-rules-item'>Используйте мышь, чтобы выбрать.</li>
            <li class='game-rules-item'>Используйте цифровые клавиши от 1 до 5 для выбора ответа.</li>
            <li class='game-rules-item'>Используйте пробел для повтроного звучания слова.</li>
            <li class='game-rules-item'>Используйте клавишу Enter для подсказки или для перехода к следующему слову.</li>
          </ul>
          <h4 class='audiocall-select-title'>Выберите уровень сложности</h3>
          <ul class='levels-list'>
            <li class='levels-list-item'>1</li>
            <li class='levels-list-item'>2</li>
            <li class='levels-list-item'>3</li>
            <li class='levels-list-item'>4</li>
            <li class='levels-list-item'>5</li>
            <li class='levels-list-item'>6</li>
          </ul>
        </div>
      </div>
    `
  }

  getGamePage(): void {
    const main = document.querySelector('.main-content') as HTMLElement;
    main.innerHTML = `
      <div class='audiocall-gamepage'>
        <div tabindex="0" class='sound-btn gamepage-item'></div>
        <ul class='options-list gamepage-item'>
        <li tabindex="0" class='options-list-item'></li>
        <li tabindex="0" class='options-list-item'></li>
        <li tabindex="0" class='options-list-item'></li>
        <li tabindex="0" class='options-list-item'></li>
        </ul>
        <button tabindex="0" class='scroll-btn gamepage-item'>Не знаю</button>
      </div>
    `
  }

  lvlListItemslistener(lvlListItems: NodeList) {
    lvlListItems.forEach((listItem, sectionDictionary) => {
      listItem.addEventListener('click', async () => {
        this.resetCounters();
        this.getGamePage();
        const pageSectionNumber = Math.floor(Math.random() * 30);
        //запрос на создание с навигационной страницы
        let wordsArr;
        if (auth.user) {
          const filter = `%7B%22$and%22%3A%5B%7B%22group%22%3A${sectionDictionary}%7D%2C%7B%22page%22%3A${pageSectionNumber}%7D%5D%7D`;
          wordsArr = await api.getAggregatedWords(auth.user.userId, auth.user.token, filter);
        } else {
          wordsArr = await api.getWords(sectionDictionary, pageSectionNumber);
        }
        //
        const scrollBtn: HTMLElement | null = document.querySelector('.scroll-btn');
        await this.getNewPage(wordsArr, this.wordNumber);

        const variantBtns: NodeList = document.querySelectorAll('.options-list-item');
        this.scrollBtnListener(wordsArr, variantBtns);
        this.variantsBtnsClickListener(variantBtns, wordsArr, scrollBtn);
        this.variantsBtnsKeyListener(variantBtns, wordsArr, scrollBtn);

      });
    });
  }

  resetCounters() {
    this.wordNumber = 0;
    this.correctAnswers = 0;
    this.errors = 0;
    this.answerStatuses = [];
    this.newWords = 0;
    this.learnsWord = 0;
  }

  scrollBtnListener(wordsArr: any, variantBtns: NodeList, isTextbook?: boolean | undefined) {
    const scrollBtn: HTMLElement | null = document.querySelector('.scroll-btn');
    scrollBtn?.addEventListener('mousedown', async (e: Event) => {
      if (scrollBtn.textContent === 'Не знаю') {
        this.errors++;
        this.answerStatuses.push('falsy-answer');
        if (auth.user) {
          if (wordsArr[this.wordNumber].userWord) {
            await api.updateUserWord(auth.user!.userId, auth.token, wordsArr[this.wordNumber]._id, { difficulty: 'normal', optional: { correctCount: wordsArr[this.wordNumber].userWord.optional.correctCount, totalIncorrectCount: wordsArr[this.wordNumber].userWord.optional.totalIncorrectCount + 1, totalCorrectCount: wordsArr[this.wordNumber].userWord.optional.totalCorrectCount } });
          } else {
            await api.createUserWord(auth.user!.userId, wordsArr[this.wordNumber]._id, auth.token, { difficulty: 'normal', optional: { correctCount: 0, totalIncorrectCount: 1, totalCorrectCount: 0 } });
          }
        }
      }

      if (this.wordNumber < wordsArr.length - 1) {
        this.wordNumber++;
        this.getNewPage(wordsArr, this.wordNumber);
        this.resetStyles(variantBtns);
        scrollBtn!.textContent = 'Не знаю'
      } else {
        console.log('Конец игры');
        console.log(this.getStrick())
        this.createEndPage(wordsArr, isTextbook);
        if (auth.user) {
          await this.changeStatistics(auth.user!.userId, auth.token, {
            learnedWords: 0,
            optional: {
              audiocall: {
                correctWords: this.correctAnswers,
                incorrectWords: this.errors,
                streak: this.getStrick(),
                newWords: this.newWords,
              },
              sprint: {
                correctWords: 0,
                incorrectWords: 0,
                streak: 0,
                newWords: 0,
              },
            },
          });
        }
      }
    });
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        scrollBtn!.focus();
      }
    })

    scrollBtn?.addEventListener('keyup', async (e) => {
      if (e.key === 'Enter') {
        if (scrollBtn!.textContent === 'Не знаю') {
          this.errors++;
          this.answerStatuses.push('falsy-answer');
          if (this.wordNumber < wordsArr.length - 1) {
            this.wordNumber++;
            this.getNewPage(wordsArr, this.wordNumber);
            this.resetStyles(variantBtns);
            scrollBtn!.textContent = 'Не знаю'
          } else {
            console.log('Конец игры');
            this.createEndPage(wordsArr, isTextbook);
            if (auth.user) {
              await this.changeStatistics(auth.user!.userId, auth.token, {
                learnedWords: 0,
                optional: {
                  audiocall: {
                    correctWords: this.correctAnswers,
                    incorrectWords: this.errors,
                    streak: this.getStrick(),
                    newWords: this.newWords,
                  },
                  sprint: {
                    correctWords: 0,
                    incorrectWords: 0,
                    streak: 0,
                    newWords: +0,
                  },
                },
              });
            }
          }
        } else if (scrollBtn!.textContent === 'Next') {
          if (this.wordNumber < wordsArr.length - 1) {
            this.wordNumber++;
            this.getNewPage(wordsArr, this.wordNumber);
            this.resetStyles(variantBtns);
            scrollBtn!.textContent = 'Не знаю';
          } else {
            console.log('Конец игры');
            this.createEndPage(wordsArr, isTextbook);
            if (auth.user) {
              await this.changeStatistics(auth.user!.userId, auth.token, {
                learnedWords: 0,
                optional: {
                  audiocall: {
                    correctWords: this.correctAnswers,
                    incorrectWords: this.errors,
                    streak: this.getStrick(),
                    newWords: this.newWords,
                  },
                  sprint: {
                    correctWords: 0,
                    incorrectWords: 0,
                    streak: 0,
                    newWords: 0,
                  },
                },
              });
            }
          }
        }
      }
    });
  }

  variantsBtnsKeyListener(variantBtns: NodeList, wordsArr: any, scrollBtn: HTMLElement | null) {
    const soundBtn: HTMLElement | null = document.querySelector('.sound-btn');
    document.addEventListener('keypress', (e) => {
      if (e.key === ' ') {
        soundBtn!.focus();
      } else if (e.key === '1') {
        const firstBtn = (variantBtns[0]) as HTMLElement;
        firstBtn.focus();
      } else if (e.key === '2') {
        const firstBtn = (variantBtns[1]) as HTMLElement;
        firstBtn.focus();
      } else if (e.key === '3') {
        const firstBtn = (variantBtns[2]) as HTMLElement;
        firstBtn.focus();
      } else if (e.key === '4') {
        const firstBtn = (variantBtns[3]) as HTMLElement;
        firstBtn.focus();
      }
    });

    soundBtn!.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        const audio = new Audio(`https://rs-lang-learnsword.herokuapp.com/${wordsArr[this.wordNumber].audio}`);
        audio.play();
      }
    });

    variantBtns.forEach((varBtn, index) => {
      const varientBtn = (varBtn) as HTMLElement;

      varientBtn.addEventListener('keyup', async (e) => {
        const variantsBtns: NodeList = document.querySelectorAll('.options-list-item');
        let iSgamed = false;
        variantsBtns.forEach(el => {
          const vBtn = (el) as HTMLElement;
          if (vBtn.classList.contains('correct-answer') || vBtn.classList.contains('wrong-answer')) {
            iSgamed = true;
          }
        });
        if (iSgamed === false) {
          if (e.key === String(index + 1)) {
            if (varBtn.textContent === wordsArr[this.wordNumber].wordTranslate) {
              console.log('Верный ответ');
              const btn = (varientBtn) as HTMLElement;
              btn.classList.add('correct-answer');
              this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'del-points-events', 'all');
              this.correctAnswers++;
              scrollBtn!.textContent = 'Next';
              this.answerStatuses.push('true-answer');
              if (auth.user) {
                await this.createUserWord(wordsArr, 1, 0, 1);
              }
            } else if (varBtn.textContent !== wordsArr[this.wordNumber].wordTranslate) {
              console.log('Неверный ответ');
              const btn = (varientBtn) as HTMLElement;
              btn.classList.add('wrong-answer');
              this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'correct-answer', 'one');
              this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'del-points-events', 'all');
              this.errors++;
              scrollBtn!.textContent = 'Next';
              this.answerStatuses.push('falsy-answer');
              if (auth.user) {
                await this.createUserWord(wordsArr, 0, 1, 0);
              }
            }
          }
        }
      });
    });
  }

  variantsBtnsClickListener(variantBtns: NodeList, wordsArr: any, scrollBtn: HTMLElement | null) {
    const soundBtn: HTMLElement | null = document.querySelector('.sound-btn');

    soundBtn?.addEventListener('click', () => {
      const audio = new Audio(`https://rs-lang-learnsword.herokuapp.com/${wordsArr[this.wordNumber].audio}`);
      audio.play();
    });

    variantBtns.forEach((varBtn, index) => {
      varBtn.addEventListener('click', async (e: Event) => {
        if (varBtn.textContent === wordsArr[this.wordNumber].wordTranslate) {
          console.log('Верный ответ');
          const btn = (e.target) as HTMLElement;
          btn.classList.add('correct-answer');
          this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'del-points-events', 'all');
          this.correctAnswers++;
          scrollBtn!.textContent = 'Next'
          this.answerStatuses.push('true-answer');
          if (auth.user) {
            await this.createUserWord(wordsArr, 1, 0, 1);
          }
        } else if (varBtn.textContent !== wordsArr[this.wordNumber].wordTranslate) {
          const btn = (e.target) as HTMLElement;
          console.log('Неверный ответ');
          btn.classList.add('wrong-answer');
          this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'correct-answer', 'one');
          this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'del-points-events', 'all');
          this.errors++;
          scrollBtn!.textContent = 'Next'
          this.answerStatuses.push('falsy-answer');
          if (auth.user) {
            await this.createUserWord(wordsArr, 0, 1, 0);
          }
        }
      });
    });
  }



  async getNewPage(wordsArray: any, wordNumber: number): Promise<void> {
    const array = wordsArray.slice();
    if (array.length < 4) {
      const addWords = await api.getWords(1, 1);
      for (let i = 0; i < 20; i++) {
        array.push(addWords[i]);
      }

    }

    const randomNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].slice(0, array.length);
    const randomWordsIndex = randomNum.filter(num => num !== wordNumber).sort(function () { return Math.random() - 0.5 }).slice(0, 3);
    randomWordsIndex.push(wordNumber);
    const mix = randomWordsIndex.sort(function () { return Math.random() - 0.5 });
    const audio = new Audio(`https://rs-lang-learnsword.herokuapp.com/${array[wordNumber].audio}`);
    audio.play();
    const variantsBtns: NodeList = document.querySelectorAll('.options-list-item');
    variantsBtns.forEach((varBtns, index) => {
      varBtns.textContent = array[mix[index]].wordTranslate;
    });

  }

  changeStyle(nodeList: NodeList, wordsArr: Array<IWord>, wordNum: number, style: string, count: string) {
    nodeList.forEach((elem) => {
      const btn = (elem) as HTMLElement;
      if (count === 'one') {
        if (btn.textContent === wordsArr[wordNum].wordTranslate) {
          btn.classList.add(`${style}`);
        }
      } else if (count === 'all') {
        btn.classList.add(`${style}`);
      }
    })
  }

  resetStyles(nodeList: NodeList) {
    nodeList.forEach((elem) => {
      const btn = (elem) as HTMLElement;
      btn.classList.remove('del-points-events');
      btn.classList.remove('correct-answer');
      btn.classList.remove('wrong-answer');
    });
  }

  getEndPageHtml(correctAnswers: number, errors: number): string {
    return `
      <section class='audiocall-results'>
        <div class='audiocall-container'>
          <h2 class='results-title'>Ваш результат</h2>
          <div class='result-percent'>${Math.round((100 / (correctAnswers + errors)) * correctAnswers)}%</div>
          <div class='answers-stats'>
            <p class='right-answers'>Верных ответов:${correctAnswers}</p>
            <p class='errors'>Ошибок:${errors}</p>
          </div>
          <div class='end-options-menu'>
            <div class='end-options-menu-item statistics'>Подробнее</div>
            <div class='end-options-menu-item repeate-game-btn'>Играть снова</div>
          </div>
        </div>
      <section>
    `
  }

  createEndPage(wordsArr: Array<IWord>, isTextbook?: boolean | undefined) {
    const main = document.querySelector('.main-content') as HTMLElement;
    this.endPageContent = this.getEndPageHtml(this.correctAnswers, this.errors)
    main!.innerHTML = this.endPageContent;
    const statBtn = document.querySelector('.statistics');
    const repeateGameBtn = document.querySelector('.repeate-game-btn');

    repeateGameBtn?.addEventListener('click', () => {
      if (isTextbook === undefined) {
        main.innerHTML = this.getHtml();
        const lvlListItems: NodeList = document.querySelectorAll('.levels-list-item');
        this.lvlListItemslistener(lvlListItems);
      } else if (isTextbook === true) {
        this.createBookVersion();
      }
    });

    statBtn?.addEventListener('click', () => {
      main.innerHTML = this.getStatistic(wordsArr);
      const returnBtn: HTMLElement | null = document.querySelector('.return-endpage-btn');
      const wordsSound: NodeList = document.querySelectorAll('.sound-word');
      wordsSound.forEach((soundBtn, index) => {
        soundBtn.addEventListener('click', () => {
          const audio = new Audio(`http://localhost:3000/${wordsArr[index].audio}`);
          audio.play();
        });
      });
      returnBtn?.addEventListener('click', () => {
        main.innerHTML = this.endPageContent;
        this.createEndPage(wordsArr, isTextbook);
      });

    })
  }

  getStatistic(wordsArr: Array<IWord>) {
    let creatStatisticItems = '';
    const creatStatisticItem = (index: number) => {
      creatStatisticItems += `
      <div class='statistic-answer-item'>
        <div class='sound-word sound-btn-${index}'></div>
        <div class='word'>${wordsArr[index].word}</div>
        <div class='word-transc'>${wordsArr[index].transcription}</div>
        <div class='word-translate'>${wordsArr[index].wordTranslate}</div>
        <div class='answer-status answer-status-${index} ${this.answerStatuses[index]}'></div>
      </div>`
    }

    for (let i = 0; i < wordsArr.length; i++) {
      creatStatisticItem(i);
    }
    return `
    <section class='statistic-answer'>
      <div class='statistic-container'>
        ${creatStatisticItems}
      <div class='return-btn'>
        <div class='return-endpage-btn'>Назад</div>
      </div>
      </div>
    <section>
    `
  }

  async createUserWord(wordsArr: Array<any>, correctCount: number, totalIncorrectCount: number, totalCorrectCount: number): Promise<void> {
    if (wordsArr[this.wordNumber].userWord) {
      await api.updateUserWord(auth.user!.userId, auth.token, wordsArr[this.wordNumber]._id, { difficulty: wordsArr[this.wordNumber].difficulty, optional: { correctCount: correctCount === 1 ? wordsArr[this.wordNumber].userWord.optional.correctCount + correctCount : 0, totalIncorrectCount: wordsArr[this.wordNumber].userWord.optional.totalIncorrectCount + totalIncorrectCount, totalCorrectCount: wordsArr[this.wordNumber].userWord.optional.totalCorrectCount + totalCorrectCount } });
      const userWord = await api.getUserWord(auth.user!.userId, auth.token, wordsArr[this.wordNumber]._id);

      if (userWord.optional.correctCount > 2 && userWord.difficulty === 'normal') {
        await api.updateUserWord(auth.user!.userId, auth.token, wordsArr[this.wordNumber]._id, { difficulty: 'easy', optional: { correctCount: userWord.optional.correctCount, totalIncorrectCount: userWord.optional.totalIncorrectCount, totalCorrectCount: userWord.optional.totalCorrectCount } });
        this.learnsWord++;
      } else if (userWord.optional.correctCount > 4 && userWord.difficulty === 'hard') {
        await api.updateUserWord(auth.user!.userId, auth.token, wordsArr[this.wordNumber]._id, { difficulty: 'easy', optional: { correctCount: userWord.optional.correctCount, totalIncorrectCount: userWord.optional.totalIncorrectCount, totalCorrectCount: userWord.optional.totalCorrectCount } });
        this.learnsWord++;
      } else if (userWord.optional.correctCount === 0 && userWord.difficulty === 'easy') {
        await api.updateUserWord(auth.user!.userId, auth.token, wordsArr[this.wordNumber]._id, { difficulty: 'normal', optional: { correctCount: userWord.optional.correctCount, totalIncorrectCount: userWord.optional.totalIncorrectCount, totalCorrectCount: userWord.optional.totalCorrectCount } });
      }


    } else {
      await api.createUserWord(auth.user!.userId, wordsArr[this.wordNumber]._id, auth.token, { difficulty: 'normal', optional: { correctCount: correctCount, totalIncorrectCount: totalIncorrectCount, totalCorrectCount: totalCorrectCount } });
      this.newWords++;
    }
  }

  async changeStatistics(userId: string, token: string, body: IStatisticsObj) {
    let statistic = await api.getStatistics(userId, token);
    if (statistic === null) {
      await api.updateStatistics(userId, token, body);
      let neWstatistic = await api.getStatistics(userId, token);
      console.log(neWstatistic);
    } else {
      await api.updateStatistics(userId, token, {
        learnedWords: statistic.learnedWords! + this.learnsWord,
        optional: {
          audiocall: {
            correctWords: statistic.optional.audiocall.correctWords + this.correctAnswers,
            incorrectWords: statistic.optional.audiocall.incorrectWords + this.errors,
            streak: statistic.optional.audiocall.streak > this.getStrick() ? statistic.optional.audiocall.streak : this.getStrick(),
            newWords: statistic.optional.audiocall.newWords + this.newWords,
          },
          sprint: {
            correctWords: statistic.optional.sprint.correctWords,
            incorrectWords: statistic.optional.sprint.incorrectWords,
            streak: statistic.optional.sprint.streak,
            newWords: statistic.optional.sprint.newWords,
          },
        },
      });
      let neWstatistic = await api.getStatistics(userId, token);
      console.log(neWstatistic);
    }
  }

  getStrick(): number {
    const answerStatuses = this.answerStatuses.slice();
    let strick = 0;
    let maxLengthStrick = 0;
    for (let i = 0; i < answerStatuses.length; i++) {
      if (answerStatuses[i] === 'true-answer') {
        maxLengthStrick++;
        maxLengthStrick > strick ? strick = maxLengthStrick : strick;
      } else {
        maxLengthStrick > strick ? strick = maxLengthStrick : strick;
        maxLengthStrick = 0;
      }
    }

    return strick;
  }

}