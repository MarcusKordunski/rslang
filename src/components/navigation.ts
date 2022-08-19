export class Navigation {
  getHtml(): string {
    return `
    <container id='nav-container'>
      <div class='nav-item' id='main-page'></div>
      <div class='nav-item' id='textbook-page'></div>
      <div class='nav-item' id='games-page'></div>
      <div class='nav-item' id='statistic-page'></div>
      <div class='nav-item' id='logout-page'></div>
    </container>`
  }
}