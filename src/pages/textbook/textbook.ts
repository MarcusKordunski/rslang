import { IWord } from "../../types/types";
import create from "../../utils/create";
import { Word } from "./word";
import { api } from "../../ts/api";

export class Textbook {

  public activePage: number;
  public activePageDiv!: HTMLElement;
  public prevPageBtn!: HTMLButtonElement;
  public nextPageBtn!: HTMLButtonElement;

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
    const audioImg = create('img', 'textbook-games__img', audioGame);
    const audioTitle = create('p', 'textbook-games__title', audioGame);
    audioTitle.textContent = 'Аудио вызов';
    this.groupsDiv = create('div', 'textbook-groups', this.textbookContainer);
    this.paginationDiv = create('div', 'textbook-pagination', this.textbookContainer);
    this.textbook = create('div', 'textbook', this.textbookContainer);
  }

  init() {
    this.textbookContainer.innerHTML = '';
    this.getHtml();
    this.initGroups();
    this.initPagination();
    return this.textbookContainer;
  }

  initGroups() {
    const groupsArray: HTMLElement[] = [];
    for (let i = 0; i < 7; i++) {
      const group = create('div', 'words-group', this.groupsDiv, undefined, ['id', `group-${i}`]);
      group.innerHTML = `${i + 1}`;
      groupsArray.push(group);
    }

    groupsArray.forEach((group, index) => {
      group.addEventListener('click', async () => {
        this.activeGroup = index;
        this.activePage = 0;
        localStorage.setItem('rs-lang-active-page', `${this.activePage}`);
        this.activePageDiv.textContent = `${this.activePage + 1}`;
        localStorage.setItem('rs-lang-active-group', `${this.activeGroup}`);
        await this.initWords();
      })
    })
  }

  initPagination() {
    this.prevPageBtn = create('button', 'textbook-pagination__btn prev-btn', this.paginationDiv) as HTMLButtonElement;
    this.prevPageBtn.innerHTML = `<`;
    this.activePageDiv = create('div', 'textbook-pagination__page', this.paginationDiv);
    this.activePageDiv.textContent = `${this.activePage + 1}`;
    this.nextPageBtn = create('button', 'textbook-pagination__btn next-btn', this.paginationDiv) as HTMLButtonElement;
    this.nextPageBtn.innerHTML = `>`;

    this.nextPageBtn.addEventListener('click', async () => {
      if (this.activePage + 1 < 30) {
        this.activePage += 1;
        localStorage.setItem('rs-lang-active-page', `${this.activePage}`);
        this.activePageDiv.textContent = `${this.activePage + 1}`;
        await this.initWords();
      }
    });

    this.prevPageBtn.addEventListener('click', async () => {
      if (this.activePage - 1 >= 0) {
        this.activePage -= 1;
        localStorage.setItem('rs-lang-active-page', `${this.activePage}`);
        this.activePageDiv.textContent = `${this.activePage + 1}`;
        await this.initWords();
      }
    });
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
          this.audioPlayer.src = `http://localhost:3000/${this.wordsOnPage[index].audioTracks[count]}`;
          this.audioPlayer.play();
          this.audioPlayer.onended = () => {
            count++;
            if (count < this.wordsOnPage[index].audioTracks.length) {
              this.audioPlayer.src = `http://localhost:3000/${this.wordsOnPage[index].audioTracks[count]}`;
              this.audioPlayer.play();
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
    const words: IWord[] = await api.getWords(this.activeGroup, this.activePage);
    words.forEach((item) => {
      const word = new Word(item);
      this.wordsOnPage.push(word);
      this.textbook.appendChild(word.wordContainer);
    });
    this.initAudio();
    this.prevPageBtn.disabled = this.activePage === 0;
    this.nextPageBtn.disabled = this.activePage === 29;
  }


}