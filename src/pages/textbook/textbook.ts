import { IWord } from "../../types/types";
import create from "../../utils/create";
import { Word } from "./word";
import { api } from "../../ts/api";
import { auth } from "../../index";
import { AudiocallPage } from "../../games/audiocall/create-page";

export class Textbook {

  public activePage: number;
  public activePageDiv!: HTMLElement;
  public prevPageBtn!: HTMLButtonElement;
  public nextPageBtn!: HTMLButtonElement;
  public pageEnterInput!: HTMLInputElement;

  public activeGroup: number;
  public textbookContainer: HTMLElement;
  public wordsOnPage!: Word[];
  public textbook!: HTMLElement;
  public paginationDiv!: HTMLElement;
  public groupsDiv!: HTMLElement;
  public audioPlayer!: HTMLAudioElement;

  constructor() {
    this.textbookContainer = create('div', 'textbook-container');
    this.activePage = Number(localStorage.getItem('rs-lang-active-page')) || 0;
    this.activeGroup = Number(localStorage.getItem('rs-lang-active-group')) || 0;
    this.audioPlayer = new Audio();
  }

  getHtml() {
    const games = create('div', 'textbook-games', this.textbookContainer);
    const sprintGame = create('div', 'textbook-games__sprint', games);
    const sprintImg = create('img', 'textbook-games__img', sprintGame);
    const sprintTitle = create('p', 'textbook-games__title', sprintGame);
    sprintTitle.textContent = 'Спринт';
    const audioGame = create('div', 'textbook-games__audio', games);
    audioGame.addEventListener('click', () => {
      const audiocall = new AudiocallPage();
      audiocall.createBookGame();
    });
    const audioImg = create('img', 'textbook-games__img', audioGame);
    const audioTitle = create('p', 'textbook-games__title', audioGame);
    audioTitle.textContent = 'Аудио вызов';
    this.paginationDiv = create('div', 'textbook-pagination', this.textbookContainer);
    const textbookBody = create('div', 'textbook-body', this.textbookContainer);
    this.textbook = create('div', 'textbook', textbookBody);
    this.groupsDiv = create('div', 'textbook-groups', textbookBody);
    
  }

  init() {
    this.textbookContainer.innerHTML = '';
    this.getHtml();
    this.initGroups();
    this.initPagination();
    if (this.activeGroup !== 6) {
      this.initWords();
    } else {
      this.initHardWords();
    }
    return this.textbookContainer;
  }

  initGroups() {
    const groupTitle = create('h2', 'group-title', this.groupsDiv);
    groupTitle.textContent = 'Группы'
    const groupsArray: HTMLElement[] = [];
    for (let i = 0; i < 7; i++) {
      const group = create('div', 'words-group', this.groupsDiv, undefined, ['id', `group-${i}`]);
      const groupNum = create('div', 'words-group__num', group, undefined, ['id', `group-1${i}`]);
      groupNum.innerHTML = `${i + 1}`;
      groupsArray.push(group);
    }
    groupsArray[this.activeGroup].classList.add('active');
    !auth.user ? groupsArray[6].classList.add('close') : groupsArray[6].classList.remove('close');

    groupsArray.forEach((group, index) => {
      group.addEventListener('click', async () => {
        this.activeGroup = index;
        this.activePage = 0;
        groupsArray.forEach(item => item.classList.remove('active'));
        group.classList.add('active');
        localStorage.setItem('rs-lang-active-page', `${this.activePage}`);
        this.activePageDiv.textContent = `${this.activePage + 1}`;
        localStorage.setItem('rs-lang-active-group', `${this.activeGroup}`);
        if (this.activeGroup === 6) {
          await this.initHardWords();
        } else {
          await this.initWords();
        };
      });
    })
  }

  initPagination() {
    this.prevPageBtn = create('button', 'textbook-pagination__btn prev-btn', this.paginationDiv) as HTMLButtonElement;
    this.prevPageBtn.innerHTML = `<`;
    this.activePageDiv = create('div', 'textbook-pagination__page', this.paginationDiv);
    this.activePageDiv.textContent = `${this.activePage + 1}`;
    this.nextPageBtn = create('button', 'textbook-pagination__btn next-btn', this.paginationDiv) as HTMLButtonElement;
    this.nextPageBtn.innerHTML = `>`;
    this.pageEnterInput = create('input', 'textbook-pagination__enter', this.paginationDiv, undefined, ['type', 'number']) as HTMLInputElement;
    this.pageEnterInput.max = '30';
    this.pageEnterInput.min = '1';
    const pageEnterButton = create('button', 'textbook-pagination__btn enter-btn', this.paginationDiv) as HTMLButtonElement;
    pageEnterButton.textContent = 'Перейти';


    this.nextPageBtn.addEventListener('click', () => {
      if (this.activePage + 1 < 30) {
        this.activePage += 1;
        localStorage.setItem('rs-lang-active-page', `${this.activePage}`);
        this.initWords();
      }
    });

    this.prevPageBtn.addEventListener('click', () => {
      if (this.activePage - 1 >= 0) {
        this.activePage -= 1;
        localStorage.setItem('rs-lang-active-page', `${this.activePage}`);
        this.initWords();
      }
    });

    pageEnterButton.addEventListener('click', () => {
      if (this.pageEnterInput.value) {
        this.activePage = +this.pageEnterInput.value - 1;
        localStorage.setItem('rs-lang-active-page', `${this.activePage}`);
        this.pageEnterInput.value = '';
        this.initWords();
      }
    })
  }

  checkPaginationButtons() {
    if (this.activePage === 0) {
      this.prevPageBtn.disabled = true;
      this.nextPageBtn.disabled = false;
      this.prevPageBtn.classList.add('disabled');
      this.nextPageBtn.classList.remove('disabled');
    } else if (this.activePage === 29) {
      this.nextPageBtn.disabled = true;
      this.prevPageBtn.disabled = false;
      this.nextPageBtn.classList.add('disabled');
      this.prevPageBtn.classList.remove('disabled');
    } else {
      this.nextPageBtn.disabled = false;
      this.prevPageBtn.disabled = false;
      this.nextPageBtn.classList.remove('disabled');
      this.prevPageBtn.classList.remove('disabled');
    }
    this.activePageDiv.textContent = `${this.activePage + 1}`;
  }

  initAudio() {
    const audioButtons: HTMLElement[] = this.wordsOnPage.map(item => item.wordAudio);
    audioButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (!this.wordsOnPage[index].isPlayed) {
          this.wordsOnPage.forEach(item => item.audioBtnImg.src = `./assets/icons/play.png`);
          this.wordsOnPage[index].audioBtnImg.src = `./assets/icons/pause.png`;
          this.wordsOnPage.forEach(item => item.isPlayed = false);
          this.wordsOnPage[index].isPlayed = true;
          let count = 0;
          this.audioPlayer.src = `https://rs-lang-learnsword.herokuapp.com/${this.wordsOnPage[index].audioTracks[count]}`;
          this.audioPlayer.play();
          this.audioPlayer.onended = () => {
            count++;
            if (count < this.wordsOnPage[index].audioTracks.length) {
              this.audioPlayer.src = `https://rs-lang-learnsword.herokuapp.com/${this.wordsOnPage[index].audioTracks[count]}`;
              this.audioPlayer.play();
            } else {
              this.wordsOnPage[index].audioBtnImg.src = `./assets/icons/play.png`;
              this.wordsOnPage[index].isPlayed = false;
            }
          };
        } else {
          this.wordsOnPage[index].audioBtnImg.src = `./assets/icons/play.png`;
          this.wordsOnPage[index].isPlayed = false;
          this.audioPlayer.pause();
          this.audioPlayer.currentTime = 0;
        }

      })
    })
  }

  async initWords() {
    this.wordsOnPage = [];
    this.textbook.innerHTML = '';
    this.paginationDiv.style.display = 'flex';

    if (auth.user) {
      const filter = `%7B%22$and%22%3A%5B%7B%22group%22%3A${this.activeGroup}%7D%2C%7B%22page%22%3A${this.activePage}%7D%5D%7D`;
      const words: IWord[] = await api.getAggregatedWords(auth.user.userId, auth.user.token, filter);
      words.forEach((item) => {
        const word = new Word(item);
        this.wordsOnPage.push(word);
        word.init();
        word.deleteFromHardButton.remove();
        if (word.userWord?.difficulty === 'hard') word.wordContainer.classList.add('hard');
        if (word.userWord?.difficulty === 'easy') word.wordContainer.classList.add('easy');
        this.textbook.appendChild(word.wordContainer);
      });
    } else {
      const words: IWord[] = await api.getWords(this.activeGroup, this.activePage);
      words.forEach((item) => {
        const word = new Word(item);
        word.init();
        this.textbook.appendChild(word.wordContainer);
        this.wordsOnPage.push(word);
      });
    }
    this.initAudio();
    this.checkPaginationButtons();
  }

  async initHardWords() {
    this.wordsOnPage = [];
    this.textbook.innerHTML = '';
    this.paginationDiv.style.display = 'none';
    const filter: string = '%7B%22userWord.difficulty%22%3A%22hard%22%7D';
    const words: IWord[] = await api.getAggregatedWords(auth.user!.userId, auth.user!.token, filter, 3600);
    words.forEach((item) => {
      const word = new Word(item);
      this.wordsOnPage.push(word);
      word.init();
      word.difficultyButton.remove();
      word.learnedButton.remove();
      this.textbook.appendChild(word.wordContainer);
    });
    this.initAudio();
    console.log(words)
  }

 


}