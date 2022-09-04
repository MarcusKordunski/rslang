import { IWord, IOptionalWord, IUserWord } from "../../types/types";
import create from "../../utils/create";
import { auth } from "../..";
import { api } from "../../ts/api";

export class Word {

  public id: string;
  public group: number;
  public page: number;
  public word: string;
  public image: string;
  public audio: string;
  public audioMeaning: string;
  public audioExample: string;
  public textMeaning: string;
  public textExample: string;
  public transcription: string;
  public wordTranslate: string;
  public textMeaningTranslate: string;
  public textExampleTranslate: string;

  public wordContainer!: HTMLElement;
  public audioTracks!: string[];
  public wordAudio!: HTMLElement;
  public isPlayed: boolean;
  public audioBtnImg!: HTMLImageElement;

  public learnedButton!: HTMLButtonElement;
  public difficultyButton!: HTMLButtonElement;
  public deleteFromHardButton!: HTMLButtonElement;

  public wordBody!: HTMLElement;
  public userWord!: IUserWord | undefined;

  constructor(word: IWord) {
    this.id = word._id || word.id;
    this.group = word.group;
    this.page = word.page;
    this.word = word.word;
    this.image = word.image;
    this.audio = word.audio;
    this.audioMeaning = word.audioMeaning;
    this.audioExample = word.audioExample;
    this.textMeaning = word.textMeaning;
    this.textExample = word.textExample;
    this.textMeaningTranslate = word.textMeaningTranslate;
    this.textExampleTranslate = word.textExampleTranslate;
    this.wordTranslate = word.wordTranslate;
    this.transcription = word.transcription;
    this.userWord = word.userWord;
    this.isPlayed = false;
  }

  init() {
    this.getHtml();
    if (auth.user) {
      this.getUserWordsStatistic();
      this.getUserButtons();
    }

  }

  getHtml() {
    this.wordContainer = create('div', 'textbook__word word-card');

    const wordImgBox: HTMLElement = create('div', 'word-card__img-box', this.wordContainer);
    const wordImg: HTMLElement = create('img', 'word-card__img', wordImgBox, undefined, ['src', `https://rs-lang-learnsword.herokuapp.com/${this.image}`], ['alt', `${this.word}`]);

    this.wordBody = create('div', 'word-card__body', this.wordContainer);

    const wordTop: HTMLElement = create('div', 'word-card__top', this.wordBody);
    const wordTitle: HTMLElement = create('div', 'word-card__title-box', wordTop);
    this.wordAudio = create('div', 'word-card__audio', wordTop);
    this.audioBtnImg = create('img', 'word-card__audio-btn', this.wordAudio, undefined, ['src', './assets/icons/play.png'], ['alt', 'play']) as HTMLImageElement;
    this.audioTracks = [this.audio, this.audioMeaning, this.audioExample];

    const wordTitleRowTop: HTMLElement = create('div', 'word-card__title-row', wordTitle);
    const wordTitleRowBottom: HTMLElement = create('div', 'word-card__title-row', wordTitle);

    const wordName: HTMLElement = create('div', 'word-card__word', wordTitleRowTop);
    wordName.textContent = `${this.word}`;
    const wordTanscription: HTMLElement = create('div', 'word-card__transcription', wordTitleRowTop);
    wordTanscription.textContent = `${this.transcription}`;
    const wordTranslate: HTMLElement = create('div', 'word-card__translate', wordTitleRowBottom);
    wordTranslate.textContent = `${this.wordTranslate}`;

    const wordMid: HTMLElement = create('div', 'word-card__mid', this.wordBody);
    const wordMeaning: HTMLElement = create('div', 'word-card__meaning', wordMid);
    wordMeaning.innerHTML = `${this.textMeaning}`;
    const wordMeaningTranslate: HTMLElement = create('div', 'word-card__meaning-translate', wordMid);
    wordMeaningTranslate.textContent = `${this.textMeaningTranslate}`;

    const wordBottom: HTMLElement = create('div', 'word-card__bottom', this.wordBody);
    const wordExample: HTMLElement = create('div', 'word-card__example', wordMid);
    wordExample.innerHTML = `${this.textExample}`;
    const wordExampleTranslate: HTMLElement = create('div', 'word-card__example-translate', wordMid);
    wordExampleTranslate.textContent = `${this.textExampleTranslate}`;
  }

  getUserButtons() {
    const wordButtons: HTMLElement = create('div', 'word-card__buttons', this.wordBody);
    this.learnedButton = create('button', 'word-card__learned-btn', wordButtons) as HTMLButtonElement;
    this.learnedButton.textContent = 'Изучено';
    this.difficultyButton = create('button', 'word-card__hard-btn', wordButtons) as HTMLButtonElement;
    this.difficultyButton.textContent = 'Сложное';
    this.deleteFromHardButton = create('button', 'word-card__delete-btn', wordButtons) as HTMLButtonElement;
    this.deleteFromHardButton.textContent = 'Удалить';


    this.learnedButton.addEventListener('click', () => { this.toggleEasyUserWord() });
    this.difficultyButton.addEventListener('click', () => { this.toggleHardUserWord() });
    this.deleteFromHardButton.addEventListener('click', async () => {
      await this.toggleHardUserWord();
      this.wordContainer.style.display = 'none';
    })
  }

  getUserWordsStatistic() {
    const wordTracker: HTMLElement = create('div', 'word-card__tracker', this.wordBody);
    const correctDiv: HTMLElement = create('div', 'word-card__correct-div', wordTracker);
    const incorrectDiv: HTMLElement = create('div', 'word-card__incorrect-div', wordTracker);
    const correctTitle: HTMLElement = create('p', 'word-card__statistic-title', correctDiv);
    correctTitle.textContent = 'Правильно отгадано: ';
    const incorrectTitle: HTMLElement = create('p', 'word-card__statistic-title', incorrectDiv);
    incorrectTitle.textContent = 'Неправильно отгадано: ';
    const correctCount: HTMLElement = create('p', 'word-card__correct-count', correctDiv);
    correctCount.textContent = this.userWord ? `${this.userWord.optional.totalCorrectCount}` : `0`;
    const incorrectCount: HTMLElement = create('p', 'word-card__incorrect-count', incorrectDiv);
    incorrectCount.textContent = this.userWord ? `${this.userWord.optional.totalIncorrectCount}` : `0`;
  }

  createUserWordOptions(
    difficulty: string,
    correctCount: number = this.userWord ? this.userWord!.optional.correctCount : 0,
    totalCorrectCount: number = this.userWord ? this.userWord!.optional.totalCorrectCount : 0,
    totalIncorrectCount: number = this.userWord ? this.userWord!.optional.totalIncorrectCount : 0
  ): IUserWord {
    return {
      difficulty: difficulty,
      optional: {
        correctCount: correctCount,
        totalCorrectCount: totalCorrectCount,
        totalIncorrectCount: totalIncorrectCount
      }
    }
  }

  async toggleEasyUserWord() {
    if (!this.userWord) {
      await api.createUserWord(auth.user!.userId, this.id, auth.token, this.createUserWordOptions('easy'));
      this.userWord = this.createUserWordOptions('easy');
      this.wordContainer.classList.add('easy');
    } else {
      if (this.userWord.difficulty === 'easy') {
        await api.updateUserWord(auth.user!.userId, auth.token, this.id, this.createUserWordOptions('normal'));
        this.userWord = this.createUserWordOptions('normal');
        this.wordContainer.classList.remove('easy');
      } else if (this.userWord.difficulty === 'hard' || this.userWord.difficulty === 'normal') {
        await api.updateUserWord(auth.user!.userId, auth.token, this.id, this.createUserWordOptions('easy'));
        this.userWord = this.createUserWordOptions('easy');
        this.wordContainer.classList.remove('hard');
        this.wordContainer.classList.add('easy');
      }
    }
  }

  async toggleHardUserWord() {
    if (!this.userWord) {
      await api.createUserWord(auth.user!.userId, this.id, auth.token, this.createUserWordOptions('hard'));
      this.userWord = this.createUserWordOptions('hard');
      this.wordContainer.classList.add('hard');
    } else {
      if (this.userWord.difficulty === 'hard') {
        await api.updateUserWord(auth.user!.userId, auth.token, this.id, this.createUserWordOptions('normal'));
        this.userWord = this.createUserWordOptions('normal');
        this.wordContainer.classList.remove('hard');
      } else if (this.userWord.difficulty === 'easy' || this.userWord.difficulty === 'normal') {
        await api.updateUserWord(auth.user!.userId, auth.token, this.id, this.createUserWordOptions('hard'));
        this.userWord = this.createUserWordOptions('hard');
        this.wordContainer.classList.remove('easy');
        this.wordContainer.classList.add('hard');
      }
    }
  }
}