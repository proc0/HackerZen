class Item extends View {
  static LOAD_COUNT = 3

  static attach(item, child) {
    if (child?.childNodes.length) {
      item.append(child)
    }

    return item
  }

  static onLoad(event) {
    event.stopPropagation()
    const article = event.target.parentElement.parentElement
    const childCount = Item.countChildren(article)

    if (article instanceof Page) {
      return article.dispatchEvent(
        View.getLoadEvent(childCount, Page.LOAD_COUNT, Page.getStory(article))
      )
    }

    const itemId = article.getAttribute('id')
    const kidsNumber = Number(article.getAttribute('data-kids'))
    const kidsLength = kidsNumber > Item.LOAD_COUNT ? kidsNumber - childCount : kidsNumber
    const kidsLeft = kidsLength > Item.LOAD_COUNT ? kidsLength - Item.LOAD_COUNT : 0
    article.setAttribute('data-kids', kidsLeft)
    article.querySelector('details').setAttribute('open', '')

    if (kidsLeft === 0) {
      event.target.parentElement.remove()
    } else {
      event.target.textContent = `${'✛'.repeat(kidsLeft)}`
    }

    return article.dispatchEvent(View.getLoadEvent(childCount, Item.LOAD_COUNT, Number(itemId)))
  }

  static onExpand(event) {
    event.stopPropagation()
    const article = event.target.parentElement
    const loader = Item.queryLoader(article)

    Item.toggleContainer(article)

    if (!Item.countChildren(article) && !!loader) {
      loader.click()
    }
  }

  static queryContainer(item) {
    return item.querySelector('details')
  }

  static queryLoader(item) {
    return item.querySelector('& > footer button')
  }

  static countChildren(item) {
    return item.querySelectorAll('details > section > article')?.length || 0
  }

  static render(item) {
    const article = document.createElement('article')
    article.setAttribute('id', item.id)

    if (item.deleted || item.dead || item.text === '[delayed]') {
      article.setAttribute('data-deleted', '')
      return article
    }

    article.setAttribute('data-kids', item.kids?.length || 0)

    const title = document.createElement('h1')
    const subtitle = document.createElement('h2')
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    const section = document.createElement('section')
    const comment = document.createElement('div')
    const footer = document.createElement('footer')

    if (item.title) {
      if (item.url) {
        const link = document.createElement('a')
        link.setAttribute('target', '_blank')
        link.setAttribute('href', item.url)
        link.textContent = item.title
        link.addEventListener('click', View.depropagate)
        title.append(link)
      } else {
        title.textContent = item.title
      }

      title.addEventListener('click', Item.onExpand)
    }

    if (item.by && item.time) {
      const username = document.createElement('span')
      username.textContent = item.by
      subtitle.textContent = ` ⏲ ${View.getEllapsedText(item.time * 1000, Date.now())} `
      subtitle.prepend(username)
      subtitle.addEventListener('click', Item.onExpand)
    }

    if (item.text) {
      comment.innerHTML = item.text
      const links = comment.querySelectorAll('a')
      if (links?.length) {
        links.forEach((link) => link.setAttribute('target', '_blank'))
      }
    }

    if (item.type === 'comment') {
      article.append(subtitle)
      article.append(comment)
    } else {
      article.append(title)
      article.append(subtitle)
      section.append(comment)
    }

    if (item.kids?.length > 0 || (item.type !== 'comment' && item.text)) {
      details.append(summary)
      details.append(section)
      article.append(details)
    }

    if (item.kids?.length > 0) {
      const button = document.createElement('button')
      button.textContent = `${'✛'.repeat(item.kids.length)}`
      button.addEventListener('click', Item.onLoad)
      footer.append(button)
      article.append(footer)
    }

    return article
  }

  static toggleContainer(item) {
    const container = Item.queryContainer(item)

    if (!container) return

    if (container.getAttribute('open') === '') {
      container.removeAttribute('open')
    } else {
      container.setAttribute('open', '')
    }
  }
}
