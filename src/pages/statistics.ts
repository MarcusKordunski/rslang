import { api } from '../ts/api';
import { auth } from "../index";
import { IStatisticsObj } from "../types/types";

export class Statistic {

  create() {
    const statisticBtns = document.querySelectorAll('.statistic-page');
    const statisticBtn = statisticBtns[1];
    const main = document.querySelector('.main-content') as HTMLElement;
    statisticBtn?.addEventListener('click', async () => {
      if (auth.user) {
        main.innerHTML = await this.getAuthHtml();
        const statistics = await api.getStatistics(auth.user!.userId, auth.token);
        await this.getAudiocallData(statistics!);
        await this.getSprintData(statistics!);
        await this.getWordstData(statistics!);
      } else {
        main.innerHTML = await this.getUnAuth();
      }
    });
  }

  async getAuthHtml() {
    return `
    <div class='statistics-content'>
      <div class='statistics-container'>          
          <div class='words-statistics stat-item'>
            <h3 class='stat-title'>Статистика по словам</h3>
            <div class='words-learned words-statistics-item stat-value'> </div>
            <div class='new-words words-statistics-item stat-value'> </div>
            <div class='accuracy-words words-statistics-item stat-value'> </div>
          </div>
          <div class='audiocall-statistics stat-item'>
            <h3 class='stat-title'>Статистика по игре "Аудиовызов"</h3>
            <div class='new-words-audiocall audiocall-statistics-item stat-value'> </div>
            <div class='accuracy-words-audiocall audiocall-statistics-item stat-value'> </div>
            <div class='combo-words-audiocall audiocall-statistics-item stat-value'> </div>
          </div>
          <div class='sprint-statistics stat-item'>
            <h3 class='stat-title'>Статитстика по игре "Спринт"</h3>
            <div class='new-words-sprint sprint-statistics-item stat-value'> </div>
            <div class='accuracy-words-sprint sprint-statistics-item stat-value'> </div>
            <div class='combo-words-sprint sprint-statistics-item stat-value'> </div>
          </div>
       
      </div>
    </div>
    `
  }

  async getUnAuth() {
    return `
    <div class='statistics-content'>Вы не авторизованны</div>
    `
  }

  async getAudiocallData(statistics: IStatisticsObj) {
    const newWordsAudiocall = document.querySelector('.new-words-audiocall');
    const accurAudiocall = document.querySelector('.accuracy-words-audiocall');
    const comboAudiocall = document.querySelector('.combo-words-audiocall');

    newWordsAudiocall!.textContent = `Новые слова: ${statistics!.optional.audiocall.newWords}`;
    accurAudiocall!.textContent = `Правильность ответов: ${Math.round((100 / (statistics!.optional.audiocall.correctWords + statistics!.optional.audiocall.incorrectWords)) * statistics!.optional.audiocall.correctWords)}%`;
    comboAudiocall!.textContent = `Максимальное комбо: ${statistics!.optional.audiocall.streak}`;
  }

  async getSprintData(statistics: IStatisticsObj) {
    const newWordSprint = document.querySelector('.new-words-sprint');
    const accurSprint = document.querySelector('.accuracy-words-sprint');
    const comboSprint = document.querySelector('.combo-words-sprint');

    newWordSprint!.textContent = `Новые слова: ${statistics!.optional.sprint.newWords}`;
    accurSprint!.textContent = `Правильность ответов: ${Math.round((100 / (statistics!.optional.sprint.correctWords + statistics!.optional.sprint.incorrectWords)) * statistics!.optional.sprint.correctWords)}%`;
    comboSprint!.textContent = `Максимальное комбо: ${statistics!.optional.sprint.streak}`;
  }

  async getWordstData(statistics: IStatisticsObj) {
    const newWords = document.querySelector('.words-learned');
    const accurWordst = document.querySelector('.new-words');
    const learnsWords = document.querySelector('.accuracy-words');

    const totalWords = statistics.optional.audiocall.correctWords + statistics.optional.audiocall.incorrectWords + statistics.optional.sprint.correctWords + statistics.optional.sprint.incorrectWords;
    const totalCorrectWords = statistics.optional.audiocall.correctWords + statistics.optional.sprint.correctWords;
    newWords!.textContent = `Новых слов изучено: ${statistics!.optional.audiocall.newWords + statistics!.optional.sprint.newWords}`;
    accurWordst!.textContent = `Правильность ответов: ${Math.round((100 / totalWords) * totalCorrectWords)}%`;
    learnsWords!.textContent = `Новых слов выучено: ${statistics!.learnedWords}`;
  }

}