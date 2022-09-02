export class Footer {
  getHtml(): string {
    return `
      <div class='footer-container container'>
        <div class='logo-rss'><a href="https://rs.school/js/"><img src='./assets/icons/rs_school_js.svg' alt='rsschool'></a></div>
        <div class='creators'>
          <a class='creators-item' href='https://github.com/zem41k'>Mihail</a>
          <a class='creators-item' href='https://github.com/antipachita'>Vladimir</a>
          <a class='creators-item' href='https://github.com/MarcusKordunski'>Marcus</a>
        </div>
        <div class="project">2022</div>
      </div>`
  }
}