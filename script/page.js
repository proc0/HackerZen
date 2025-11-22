class Page extends View {
  static BATCH_KIDS = 3
  static BATCH_POSTS = 5
  #RESOURCE

  connectedCallback() {
    this.RESOURCE = Resource[this.getAttribute('data-type')]
    this.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: { cursor: 0, count: Page.BATCH_POSTS, resource: this.RESOURCE },
      })
    )
  }

  static render(parent) {
    return (items) => {
      items.forEach((item) => {
        const post = Item.render(item)
        if (parent instanceof Page) {
          parent.appendChild(post)
        } else {
          parent.querySelector('section').appendChild(post)
        }
      })
    }
  }

  static queryLoader(item) {
    return item.querySelector('footer button')
  }

  static queryChildrenLength(item) {
    return item.querySelectorAll('section > article')?.length || 0
  }
}
