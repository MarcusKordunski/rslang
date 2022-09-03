export interface IMain {
  getHtml: () => string;
  init: () => HTMLElement;
  getAbout: () => HTMLElement;
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

export interface IUserReg {
  email: string;
  password: string;
  name?: string;
}

export interface IUserObject {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IWord {
  _id?: string;
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
  wordTranslateWrong?: string
  userWord?: IUserWord;
}

export interface IUserWord {
  difficulty: string;
  optional: IOptionalWord;
}

export interface IOptionalWord {
  correctCount: number;
  totalCorrectCount: number;
  totalIncorrectCount: number;
}

export interface IStatisticsObj {
  id?: string;
  learnedWords?: number;
  optional: {
    sprint: {
      correctWords: number;
      incorrectWords: number;
      streak: number;
      newWords: number;
    }
    audiocall: {
      correctWords: number;
      incorrectWords: number;
      streak: number;
      newWords: number;
    }
  }
}

export interface IAudiocallPage {
  createPage: () => void;
}
