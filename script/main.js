class App extends HTMLElement {
  static TAG = 'app-main'

  constructor() {
    super()
  }

  initialize() {
    customElements.define(Page.TAG, Page)
    // const page = document.createElement(Page.TAG)
    // page.setAttribute('id', HN.top.id)
    // this.appendChild(page)
    const template = document.getElementById('app')
    const node = template.content.cloneNode(true)
    this.appendChild(node)

    // const page2 = document.createElement(TAG_PAGE)
    // page2.setAttribute('data-tab', 'Ask')
    // this.appendChild(page2)

    return this
  }
}

window.onload = function () {
  customElements.define(App.TAG, App, { extends: 'main' })
  const main = document.createElement('main', { is: App.TAG }).initialize()
  document.querySelector('body').insertAdjacentElement('afterbegin', main)
}
