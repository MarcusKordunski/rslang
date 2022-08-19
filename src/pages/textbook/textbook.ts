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

  constructor() {
    this.textbookContainer = create('div', 'textbook-container');
    this.activePage = 0;
    this.activeGroup = 0;
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

    const pagination = create('div', 'textbook-paggination', this.textbookContainer);
    this.textbook = create('div', 'textbook', this.textbookContainer);
  }

  init() {
    this.textbookContainer.innerHTML = '';
    this.getHtml();
    return this.textbookContainer;
  }

  async initWords() {
    this.wordsOnPage = [];
    this.textbook.innerHTML = '';
    const words: IWord[] = await api.getWords(this.activeGroup, this.activePage);
    words.forEach((item) => {
      const word = new Word(item);
      this.wordsOnPage.push(word);
      this.textbook.appendChild(word.wordContainer);
    })
  }
}