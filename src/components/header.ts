export class Header {
  getHtml(): string {
    return `
    <container id='header-container'>
      <div id='nav-btn'></div>
      <div id='app-name'>RSSlang</div>
      <div id='auth-icon'></div>
    </container>`
  }
}