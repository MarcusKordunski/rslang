import { api } from "../../ts/api";
import { IWord } from "../../types/types";


export class StartPage {
  
  createGame(): void {
    const audiocallBtn: HTMLElement | null = document.querySelector('.audio-page');
    const main = document.querySelector('.main-content') as HTMLElement;
    audiocallBtn?.addEventListener('click', async () => {
    main.innerHTML = this.getHtml();
    const lvlListItems: NodeList = document.querySelectorAll('.levels-list-item');
    lvlListItems.forEach((listItem, sectionDictionary) => {
      listItem.addEventListener('click', async () => {
      this.getGamePage();
      let wordNumber = 0;
      const pageSectionNumber = Math.floor(Math.random() * 30);
      const wordsArr = await api.getWords(sectionDictionary, pageSectionNumber);
      this.getNewPage(wordsArr, wordNumber);
          
      const scrollBtn: HTMLElement | null = document.querySelector('.scroll-btn');
      scrollBtn?.addEventListener('click', async () => {
          wordNumber++;
          this.getNewPage(wordsArr, wordNumber);console.log('Верный ответ')
        });
      const variantBtns: NodeList= document.querySelectorAll('.options-list-item');
      variantBtns.forEach(varBtn => {
        varBtn.addEventListener('click', () => {
          if (varBtn.textContent === wordsArr[wordNumber].word) {
            console.log('Верный ответ')
          }
        })
      });
      });
      });
    });
  }

  getHtml(): string {
    return `
      <div class='audiocall-content'>
        <h2>Audio challenge</h2>
        <h3>Select the Level</h3>
        <ul class='levels-list'>
          <li class='levels-list-item'>1</li>
          <li class='levels-list-item'>2</li>
          <li class='levels-list-item'>3</li>
          <li class='levels-list-item'>4</li>
          <li class='levels-list-item'>5</li>
          <li class='levels-list-item'>6</li>
        </ul>
      </div>
    `
  }

  getGamePage(): void {
    const main = document.querySelector('.main-content') as HTMLElement;
    main.innerHTML = `
      <div class='audiocall-gamepage'>
        <div class='sound-btn gamepage-item'></div>
        <ul class='options-list gamepage-item'>
        <li class='options-list-item'></li>
        <li class='options-list-item'></li>
        <li class='options-list-item'></li>
        <li class='options-list-item'></li>
        </ul>
        <button class='scroll-btn gamepage-item'>Next</button>
      </div>
    `
  }

  async getNewPage(wordsArray: any, wordNumber: number): Promise<void>{
    const randomNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const randomWordsIndex = randomNum.filter( num => num !== wordNumber).sort(function() { return Math.random() - 0.5 }).slice(0, 3);
    randomWordsIndex.push(wordNumber);
    const mix = randomWordsIndex.sort(function() { return Math.random() - 0.5 });
    var audio = new Audio(`http://localhost:3000/${wordsArray[wordNumber].audio}`);
    audio.play();
    const variantsBtns: NodeList = document.querySelectorAll('.options-list-item');
    variantsBtns.forEach((varBtns, index) => {
      varBtns.textContent = wordsArray[mix[index]].word;
    })
  
   
  }

}