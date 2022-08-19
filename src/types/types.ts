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

export interface IAudiocallPage {
  getHtml: () => string;
}