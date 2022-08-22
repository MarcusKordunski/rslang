export interface IUserReg {
  email: string;
  password: string;
}

export interface IMain {
  getHtml: () => string;
}

export interface IFooter {
  getHtml: () => string;
}

export interface IHeader {
  getHtml: () => string;
}

export interface INavigation {
  getHtml: () => string;
}

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface IAudiocallPage {
  createPage: () => void;
}