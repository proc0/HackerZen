class Item extends View {
  static onLoadMore(event) {
    event.stopPropagation()
    const article = event.target.parentElement.parentElement
    const childrenLength = Page.queryChildrenLength(article)

    // TODO: abstract this event dispatch
    if (article instanceof Page) {
      return article.dispatchEvent(
        new CustomEvent('load', {
          bubbles: true,
          detail: {
            cursor: childrenLength,
            count: Page.BATCH_POSTS,
            resource: Resource[article.getAttribute('data-type')],
          },
        })
      )
    }

    const itemId = article.getAttribute('id')
    const kidsNumber = Number(article.getAttribute('data-kids'))
    const kidsLength = kidsNumber > Page.BATCH_KIDS ? kidsNumber - childrenLength : kidsNumber
    const kidsLeft = kidsLength > Page.BATCH_KIDS ? kidsLength - Page.BATCH_KIDS : 0
    article.setAttribute('data-kids', kidsLeft)

    if (kidsLeft === 0) {
      event.target.parentElement.remove()
    } else {
      event.target.textContent = `${'✛'.repeat(kidsLeft)}`
    }
    article.querySelector('details').setAttribute('open', '')
    return article.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: {
          cursor: childrenLength,
          count: Page.BATCH_KIDS,
          resource: Number(itemId),
        },
      })
    )
  }

  static onExpand(event) {
    event.stopPropagation()
    const article = event.target.parentElement
    const loader = Page.queryLoader(article)
    // TODO: write static isOpen, checks if it has kids and/or details element, and opens/closes it
    if (!Page.queryChildrenLength(article) && !!loader) {
      loader.click()
    } else if (article.querySelector('details')?.getAttribute('open') === '') {
      article.querySelector('details').removeAttribute('open')
    } else {
      article.querySelector('details')?.setAttribute('open', '')
    }
  }

  static render(item) {
    const article = document.createElement('article')
    article.setAttribute('id', item.id)

    if (item.deleted || item.dead || item.text === '[delayed]') {
      article.setAttribute('data-deleted', '')
      return article
    }

    article.setAttribute('data-kids', item.kids?.length || 0)

    if (item.title && item.url) {
      const title = document.createElement('h1')
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.setAttribute('href', item.url)
      link.textContent = item.title
      link.addEventListener('click', (event) => {
        event.stopPropagation()
      })
      title.append(link)
      title.addEventListener('click', Item.onExpand)
      article.append(title)
    }

    if (item.text) {
      const subtitle = document.createElement('h2')
      const username = document.createElement('span')
      username.textContent = item.by
      subtitle.textContent = ` ⏲ ${View.getEllapsedText(item.time * 1000, Date.now())} `
      subtitle.prepend(username)
      article.append(subtitle)

      const comment = document.createElement('div')
      comment.innerHTML = item.text

      const links = comment.querySelectorAll('a')
      if (links?.length) {
        links.forEach((link) => {
          link.setAttribute('target', '_blank')
        })
      }

      subtitle.addEventListener('click', Item.onExpand)
      article.append(comment)
    }

    if (item.kids?.length > 0) {
      const details = document.createElement('details')
      const summary = document.createElement('summary')
      const section = document.createElement('section')

      details.append(summary)
      details.append(section)
      article.append(details)

      const button = document.createElement('button')
      button.textContent = `${'✛'.repeat(item.kids.length)}`
      button.addEventListener('click', Item.onLoadMore)

      const footer = document.createElement('footer')
      footer.append(button)
      article.append(footer)
    }

    return article
  }
}
