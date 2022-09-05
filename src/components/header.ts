import create from '../utils/create';

export class Header {
  getHtml(): string {

    return `
    <div class='header__container container'>
      <div class='burger'>
        <span class='burger__line line1'></span>
        <span class='burger__line line2'></span>
        <span class='burger__line line3'></span>
      </div>
      <div class='burger-menu'>
        <ul class='burger-menu__list'>
          <li class='burger-menu__item main-page'>Главная</li>
          <li class='burger-menu__item textbook-page'>Учебник</li>
          <li class='burger-menu__item sprint-page'>Спринт</li>
          <li class='burger-menu__item audio-page'>Аудио Вызов</li>
          <li class='burger-menu__item statistic-page'>Статистика</li>
        </ul>
      </div>
      <div class='header__title'>RS Lang</div>
      <nav class='header__menu menu'>
        <ul class='menu__list'>
          <li class='menu__item main-page'>Главная</li>
          <li class='menu__item textbook-page'>Учебник</li>
          <li class='menu__item sprint-page'>Спринт</li>
          <li class='menu__item audio-page'>Аудио Вызов</li>
          <li class='menu__item statistic-page'>Статистика</li>
        </ul>
      </nav>
      <div class="header__user-name"></div>
      <button class='header__auth-btn'>Войти</button>
    </div>`;
  }
}