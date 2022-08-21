import { IWord } from "../../types/types";
import create from "../../utils/create";
import { Word } from "./word";
import { api } from "../../ts/api";

export class Textbook {

  public activePage: number;
  public activeGroup: number;
  public textbookContainer: HTMLElement;
  public wordsOnPage!: Word[];
  public textbook!: HTMLElement;
  public pagination!: HTMLElement;
  public audioPlayer!: HTMLAudioElement;

  constructor() {
    this.textbookContainer = create('div', 'textbook-container');
    this.activePage = 0;
    this.activeGroup = 0;
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

    this.pagination = create('div', 'textbook-pagination', this.textbookContainer);
    this.textbook = create('div', 'textbook', this.textbookContainer);
  }

  init() {
    this.textbookContainer.innerHTML = '';
    this.getHtml();
    return this.textbookContainer;
  }

  initPagination() {

  }

  initAudio() {
    const audioButtons = this.wordsOnPage.map(item => item.wordAudio);
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
  }


}