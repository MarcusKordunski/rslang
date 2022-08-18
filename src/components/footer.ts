export class Footer {
  getHtml(): string {
    return `
      <div id='footer-container'>
        <div class='logo-rss'></div>
        <div class='creators'>
          <div class='creators-item'></div>
          <div class='creators-item'></div>
          <div class='creators-item'></div>
        </div>
        <div class="project"></div>
      </div>`
  }
}