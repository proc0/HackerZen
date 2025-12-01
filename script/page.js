class Page extends View {
  static PAYLOAD = 5

  connectedCallback() {
    this.dispatchEvent(View.loadEvent(0, Page.PAYLOAD, Page.getStory(this)))
  }

  static onLoad(event) {
    event.stopPropagation()
    const page = event.target.parentElement
    const postCount = Query.countChildren(page)
    const loadEvent = View.loadEvent(postCount, Page.PAYLOAD, Page.getStory(page))
    return page.dispatchEvent(loadEvent)
  }

  static render(parent) {
    return (items) => {
      const isPage = parent instanceof Page
      const loader = Query.loader(parent)
      const container = isPage ? parent : parent.querySelector('section')

      items.forEach((item) => {
        const valid = View.normalize(item)

        if (!valid) return

        const post = Item.render(valid)

        if (loader) {
          container.insertBefore(post, loader)
        } else {
          container.appendChild(post)
        }
      })

      if (isPage && !loader) {
        const button = document.createElement('button')
        button.textContent = `Load more\n▼`
        button.addEventListener('click', Page.onLoad)
        parent.appendChild(button)
      }
    }
  }

  static getStory(page) {
    return Stories[page.getAttribute('data-type')]
  }
}
