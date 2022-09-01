import { api } from "../../ts/api";
import { IWord } from "../../types/types";


export class StartPage {

  wordNumber: number;

  correctAnswers: number;

  errors: number;

  endPageContent: string;

  answerStatuses: Array<string>;

  constructor() {
    this.wordNumber = 0;
    this.correctAnswers = 0;
    this.errors = 0;
    this.endPageContent = '';
    this.answerStatuses = [];
  }

  createGame(): void {
    const audiocallBtn: HTMLElement | null = document.querySelector('.audio-page');
    const main = document.querySelector('.main-content') as HTMLElement;
    audiocallBtn?.addEventListener('click', async () => {
      main.innerHTML = this.getHtml();
      const lvlListItems: NodeList = document.querySelectorAll('.levels-list-item');
      this.lvlListItemslistener(lvlListItems);
    });
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
        this.wordNumber = 0;
        this.correctAnswers = 0;
        this.errors = 0;
        this.answerStatuses = [];
        this.getGamePage();
        const pageSectionNumber = Math.floor(Math.random() * 30);
        const wordsArr = await api.getWords(sectionDictionary, pageSectionNumber);
        const scrollBtn: HTMLElement | null = document.querySelector('.scroll-btn');
        await this.getNewPage(wordsArr, this.wordNumber);

        const variantBtns: NodeList = document.querySelectorAll('.options-list-item');
        this.scrollBtnListener(wordsArr, variantBtns);
        this.variantsBtnsListener(variantBtns, wordsArr, scrollBtn);

      });
    });
  }

  scrollBtnListener(wordsArr: any, variantBtns: NodeList) {
    const scrollBtn: HTMLElement | null = document.querySelector('.scroll-btn');
    scrollBtn?.addEventListener('mousedown', (e: Event) => {
      if (scrollBtn.textContent === 'Не знаю') {
        this.errors++;
        this.answerStatuses.push('falsy-answer');
      }
      if (this.wordNumber < 19) {
        this.wordNumber++;
        this.getNewPage(wordsArr, this.wordNumber);
        this.resetStyles(variantBtns);
        scrollBtn!.textContent = 'Не знаю'
      } else {
        console.log('Конец игры');
        this.createEndPage(wordsArr);
      }
    });
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        scrollBtn!.focus();
      }
    })

    scrollBtn?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        if (scrollBtn!.textContent === 'Не знаю') {
          this.errors++;
          this.answerStatuses.push('falsy-answer');
          if (this.wordNumber < 19) {
            this.wordNumber++;
            this.getNewPage(wordsArr, this.wordNumber);
            this.resetStyles(variantBtns);
            scrollBtn!.textContent = 'Не знаю'
          } else {
            console.log('Конец игры');
            this.createEndPage(wordsArr);
          }
        } else if (scrollBtn!.textContent === 'Next') {
          if (this.wordNumber < 19) {
            this.wordNumber++;
            this.getNewPage(wordsArr, this.wordNumber);
            this.resetStyles(variantBtns);
            scrollBtn!.textContent = 'Не знаю';
          } else {
            console.log('Конец игры');
            this.createEndPage(wordsArr);
          }
        }
      }

    });
  }

  variantsBtnsListener(variantBtns: NodeList, wordsArr: any, scrollBtn: HTMLElement | null) {
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
    soundBtn?.addEventListener('click', () => {
      const audio = new Audio(`http://localhost:3000/${wordsArr[this.wordNumber].audio}`);
      audio.play();
    });
    soundBtn!.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        const audio = new Audio(`http://localhost:3000/${wordsArr[this.wordNumber].audio}`);
        audio.play();
      }
    });

    variantBtns.forEach((varBtn, index) => {
      const varientBtn = (varBtn) as HTMLElement;

      varientBtn.addEventListener('keyup', (e) => {
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
              scrollBtn!.textContent = 'Next'
              this.answerStatuses.push('true-answer');
            } else if (varBtn.textContent !== wordsArr[this.wordNumber].wordTranslate) {
              console.log('Неверный ответ');
              const btn = (varientBtn) as HTMLElement;
              btn.classList.add('wrong-answer');
              this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'correct-answer', 'one');
              this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'del-points-events', 'all');
              this.errors++;
              scrollBtn!.textContent = 'Next'
              this.answerStatuses.push('falsy-answer');
            }
          }
        }
      });

      varBtn.addEventListener('click', (e: Event) => {
        if (varBtn.textContent === wordsArr[this.wordNumber].wordTranslate) {
          console.log('Верный ответ');
          const btn = (e.target) as HTMLElement;
          btn.classList.add('correct-answer');
          this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'del-points-events', 'all');
          this.correctAnswers++;
          scrollBtn!.textContent = 'Next'
          this.answerStatuses.push('true-answer');
        } else if (varBtn.textContent !== wordsArr[this.wordNumber].wordTranslate) {
          const btn = (e.target) as HTMLElement;
          console.log('Неверный ответ');
          btn.classList.add('wrong-answer');
          this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'correct-answer', 'one');
          this.changeStyle(variantBtns, wordsArr, this.wordNumber, 'del-points-events', 'all');
          this.errors++;
          scrollBtn!.textContent = 'Next'
          this.answerStatuses.push('falsy-answer');
        }
      });

    });
  }



  async getNewPage(wordsArray: any, wordNumber: number): Promise<void> {

    const randomNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const randomWordsIndex = randomNum.filter(num => num !== wordNumber).sort(function () { return Math.random() - 0.5 }).slice(0, 3);
    randomWordsIndex.push(wordNumber);
    const mix = randomWordsIndex.sort(function () { return Math.random() - 0.5 });
    const audio = new Audio(`http://localhost:3000/${wordsArray[wordNumber].audio}`);
    audio.play();
    const variantsBtns: NodeList = document.querySelectorAll('.options-list-item');
    variantsBtns.forEach((varBtns, index) => {
      varBtns.textContent = wordsArray[mix[index]].wordTranslate;
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
          <div class='result-percent'>${correctAnswers * 5}%</div>
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

  createEndPage(wordsArr: Array<IWord>) {
    const main = document.querySelector('.main-content') as HTMLElement;
    this.endPageContent = this.getEndPageHtml(this.correctAnswers, this.errors)
    main!.innerHTML = this.endPageContent;
    const statBtn = document.querySelector('.statistics');
    const repeateGameBtn = document.querySelector('.repeate-game-btn');

    repeateGameBtn?.addEventListener('click', () => {
      main.innerHTML = this.getHtml();
      const lvlListItems: NodeList = document.querySelectorAll('.levels-list-item');
      this.lvlListItemslistener(lvlListItems);
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
        this.createEndPage(wordsArr);
      });

      console.log(this.answerStatuses)
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

}