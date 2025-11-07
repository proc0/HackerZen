class View extends HTMLElement {
  model = new Model()

  connectedCallback() {
    this.addEventListener('load', ({ detail, target }) => {
      this.model.getItems(detail).then(Page.render(target))
    })
  }

  constructor() {
    super()
  }

  initialize() {
    const TAG_PAGE = 'hz-page'
    customElements.define(TAG_PAGE, Page)
    const page = document.createElement(TAG_PAGE)
    this.appendChild(page)

    return this
  }
}
