export interface IMain {
  getHtml: () => string;
  init: () => HTMLElement;
  getAbout: () => HTMLElement;
  getBenefits: () => HTMLElement;
  getRegsLink: () => HTMLElement;
  getTeam: () => HTMLElement;
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

export interface IAuth {
  user: IUserObject | null;
  token: string;
  date: string | void | null;

  viewLoginForm: () => HTMLElement;
  viewRegForm: () => HTMLElement
  regUser: (user: IUserReg) => Promise<void>
  loginUser: (user: IUserReg) => Promise<void>
  logoutUser: () => void
  showStatusMessage: (message: string, background?: string) => void
}

export interface ITextbook {
  activePage: number;
  activePageDiv: HTMLElement;
  prevPageBtn: HTMLButtonElement;
  nextPageBtn: HTMLButtonElement;
  pageEnterInput: HTMLInputElement;
  activeGroup: number;
  textbookContainer: HTMLElement;
  wordsOnPage: IWordClass[];
  textbook: HTMLElement;
  paginationDiv: HTMLElement;
  groupsDiv: HTMLElement;
  audioPlayer: HTMLAudioElement;
  sprintGame: HTMLButtonElement;
  audioGame: HTMLButtonElement;
  main: HTMLElement;

  getHtml: () => void;
  init: () => HTMLElement;
  initGroups: () => void;
  initPagination: () => void;
  checkPaginationButtons: () => void;
  initAudio: () => void;
  initWords: () => Promise<void>;
  initHardWords: () => Promise<void>;
}

export interface IWordClass {
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
  wordContainer: HTMLElement;
  audioTracks: string[];
  wordAudio: HTMLElement;
  isPlayed: boolean;
  audioBtnImg: HTMLImageElement;
  learnedButton: HTMLButtonElement;
  difficultyButton: HTMLButtonElement;
  deleteFromHardButton: HTMLButtonElement;
  wordBody: HTMLElement;
  userWord: IUserWord | undefined;

  init: () => void;
  getHtml: () => void;
  getUserButtons: () => void;
  getUserWordsStatistic: () => void;
  toggleEasyUserWord: () => Promise<void>;
  toggleHardUserWord: () => Promise<void>;
}

export interface IAudiocallPage {
  createPage: () => void;
}

export interface IStatistics {
  create: () => void;
  getAuthHtml: () => Promise<string>;
  getUnAuth: () => Promise<string>;
}

export interface IView {
  header: IHeader;
  main: IMain;
  footer: IFooter;
  auth: IAuth;
  textbook: ITextbook;
  audiocall: IAudiocallPage;
  statistics: IStatistics;

  renderContainers: () => void;
  renderStartPage: () => void;
  renderHeader: () => void;
  renderMain: () => void;
  renderFooter: () => void;
  addHeaderListeners: () => void;
  renderAudiocall: () => void;
  renderStatisics: () => void;
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


