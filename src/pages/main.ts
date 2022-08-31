import create from "../utils/create";
import benefits from "../utils/benefits.json";
import team from "../utils/team.json";

export class Main {
  getHtml(): string {
    return `<div class='main-container container'>
              <div class='main-content'></div>
            </div>`;
  }

  init() {
    const main = document.querySelector('.main-content') as HTMLElement;
    const mainPage = create('div', 'main-page', main);
    mainPage.appendChild(this.getAbout());
    mainPage.appendChild(this.getBenefits());
    mainPage.appendChild(this.getTeam());
  }

  getAbout() {
    const mainAbout = create('div', 'main-page__about about');
    const aboutTitleBox = create('div', 'about__title-box', mainAbout);
    const aboutTitle = create('h1', 'about__title', aboutTitleBox);
    aboutTitle.textContent = 'RS Lang';
    const aboutSubTitle = create('p', 'about__subtitle', aboutTitleBox);
    aboutSubTitle.innerHTML = 'Изучай английский вместе с нашим приложением. <br> Теперь это стало легко и увлекательно.';
    const startBtn = create('button', 'about__start-btn', aboutTitleBox);
    startBtn.textContent = 'Начать';
    const aboutImg = create('img', 'about__img', mainAbout, undefined, ['src', './assets/images/main-page.png'], ['alt', 'learn english']);
    return mainAbout;
  }

  getBenefits() {
    const mainBenefits = create('div', 'main-page__benefits benefits');
    const benefitsTitle = create('h2', 'benefits__title', mainBenefits);
    benefitsTitle.textContent = 'Наши преимущества';
    const benefitsContainer = create('div', 'benefits__container', mainBenefits);
    for (let i = 0; i < 4; i++) {
      const benefitsItem = create('div', 'benefits__item ben-item', benefitsContainer);
      const benTitle = create('h3', 'ben-item__title', benefitsItem);
      benTitle.textContent = `${benefits[i].title}`;
      const benIcon = create('img', 'ben-item__icon', benefitsItem, undefined, ['src', `${benefits[i].icon}`], ['alt', 'icon']);
      const benText = create('p', 'ben-item__text', benefitsItem);
      benText.innerHTML = `${benefits[i].text}`;
    }


    return mainBenefits;
  }

  getTeam() {
    const mainTeam = create('div', 'main-page__team team');
    const teamTitle = create('h2', 'team__title', mainTeam);
    teamTitle.textContent = 'Наша команда';
    for (let i = 0; i < 3; i++) {
      const teamItem = create('div', 'team__item team-item', mainTeam);
      const imgDiv = create('div', 'team-item__img-box', teamItem);
      const photo = create('img', 'team-item__photo', imgDiv, undefined, ['src', `${team[i].photo}`], ['alt', 'photo']);
      const teamBody = create('div', 'team-item__body', teamItem);
      const teamName = create('h2', 'team-item__name', teamBody);
      teamName.textContent = `${team[i].name}`;
      const subTitle = create('h3', 'team-item__subtitle', teamBody);
      subTitle.textContent = `${team[i].subtitle}`;
      const teamText = create('p', 'team-item__text', teamBody);
      teamText.textContent = `${team[i].text}`;
      const githubLink = create('a', 'team-item__link', teamBody, undefined, ['href', `${team[i].ghlink}`]);
      const ghIcon = create('img', 'team-item__gh-icon', githubLink, undefined, ['src', './assets/icons/githublogo.png'], ['alt', 'github']);
    }
    return mainTeam;
  }
}