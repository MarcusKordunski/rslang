import { IWord } from "../../types/types";
import create from "../../utils/create";

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
  public wordContainer: HTMLElement;
  public audioTracks!: string[];
  public wordAudio!: HTMLElement;
  public isPlayed: boolean;
  public audioBtnImg: HTMLImageElement;

  constructor(word: IWord) {
    this.id = word.id;
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
    this.isPlayed = false;

    this.wordContainer = create('div', 'textbook__word word-card');

    const wordImgBox: HTMLElement = create('div', 'word-card__img-box', this.wordContainer);
    const wordImg: HTMLElement = create('img', 'word-card__img', wordImgBox, undefined, ['src', `http://localhost:3000/${this.image}`], ['alt', `${this.word}`]);

    const wordBody: HTMLElement = create('div', 'word-card__body', this.wordContainer);

    const wordTop: HTMLElement = create('div', 'word-card__top', wordBody);
    const wordTitle: HTMLElement = create('div', 'word-card__title-box', wordTop);
    this.wordAudio = create('div', 'word-card__audio', wordTop);
    this.audioBtnImg = create('img', 'word-card__audio-btn', this.wordAudio, undefined, ['src', './assets/icons/play.png'], ['alt', 'play']) as HTMLImageElement;
    //const audioTag = create('audio', undefined, wordAudio) as HTMLAudioElement;
    this.audioTracks = [this.audio, this.audioMeaning, this.audioExample];


    const wordTitleRowTop: HTMLElement = create('div', 'word-card__title-row', wordTitle);
    const wordTitleRowBottom: HTMLElement = create('div', 'word-card__title-row', wordTitle);

    const wordName: HTMLElement = create('div', 'word-card__word', wordTitleRowTop);
    wordName.textContent = `${this.word}`;
    const wordTanscription: HTMLElement = create('div', 'word-card__transcription', wordTitleRowTop);
    wordTanscription.textContent = `${this.transcription}`;
    const wordTranslate: HTMLElement = create('div', 'word-card__translate', wordTitleRowBottom);
    wordTranslate.textContent = `${this.wordTranslate}`;

    const wordMid: HTMLElement = create('div', 'word-card__mid', wordBody);
    const wordMeaning: HTMLElement = create('div', 'word-card__meaning', wordMid);
    wordMeaning.innerHTML = `${this.textMeaning}`;
    const wordMeaningTranslate: HTMLElement = create('div', 'word-card__meaning-translate', wordMid);
    wordMeaningTranslate.textContent = `${this.textMeaningTranslate}`;

    const wordBottom: HTMLElement = create('div', 'word-card__bottom', wordBody);
    const wordExample: HTMLElement = create('div', 'word-card__example', wordMid);
    wordExample.innerHTML = `${this.textExample}`;
    const wordExampleTranslate: HTMLElement = create('div', 'word-card__example-translate', wordMid);
    wordExampleTranslate.textContent = `${this.textExampleTranslate}`;

    const wordTracker: HTMLElement = create('div', 'word-card__tracker', wordBody);
    const wordButtons: HTMLElement = create('div', 'word-card__buttons', wordBody);
  }
}