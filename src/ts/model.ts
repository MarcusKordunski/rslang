import { IUserObject } from "../types/types";

class Model {
  public numberOfPages = 30;
  public numberOfQuestion = 20;
  public userInfo: IUserObject = JSON.parse(localStorage.getItem('rs-lang-userInfo')!);
}

export const model = new Model();