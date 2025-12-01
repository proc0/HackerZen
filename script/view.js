class View extends HTMLElement {
  static model = new Model()
  static EVENT_LOAD = 'load'

  constructor() {
    super()

    this.addEventListener(View.EVENT_LOAD, ({ detail, target }) => {
      View.render(target)
      View.model.load(detail).then(Page.render(target)).then(View.clean(target))
    })
  }

  static render(parent) {
    const isPage = parent instanceof Page
    const loader = Query.loader(parent)
    const container = isPage ? parent : parent.querySelector('section')

    const loadingText = document.createElement('span')
    loadingText.setAttribute('data-loading', '')
    loadingText.textContent = 'Loading...'

    if (loader) {
      container.insertBefore(loadingText, loader)
    } else {
      container.appendChild(loadingText)
    }
  }

  static clean(parent) {
    return () => parent.querySelector('span[data-loading]').remove()
  }

  static stopEvent(event) {
    event.stopPropagation()
  }

  static loadEvent(cursor, count, source) {
    return new CustomEvent(View.EVENT_LOAD, {
      bubbles: true,
      detail: {
        cursor,
        count,
        source,
      },
    })
  }

  static normalize(item) {
    if (item.deleted || item.dead || item.text === '[delayed]') {
      return null
    }

    if (!item.kids) {
      item.kids = []
    }

    if (item.type === 'job') {
      item.upvote = false
      item.downvote = false
      item.reply = false
      delete item.score
      delete item.by
    } else if (item.type === 'comment') {
      item.upvote = true
      item.downvote = true
      item.reply = true
    } else {
      item.upvote = true
      item.downvote = false
      item.reply = true
    }

    return item
  }
}
