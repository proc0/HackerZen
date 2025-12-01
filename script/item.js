class Item {
  static PAYLOAD = 3

  static countChildNodes(node) {
    return node.querySelectorAll('& > details > section > article')?.length || 0
  }

  static queryLoader(node) {
    return node.querySelector('& > details > section > button')
  }

  static queryReplyForm(node) {
    const form =
      node.parentElement instanceof Page
        ? node.querySelector('& > details > section > form')
        : node.querySelector('& > form')

    return form
  }

  static queryComment(node) {
    const comment =
      node.parentElement instanceof Page
        ? node.querySelector('& > details > section > div')
        : node.querySelector('& > div')

    return comment
  }

  static isContainerOpen(node) {
    const container = node.querySelector('details')

    if (!container) return false

    return container.getAttribute('open') === ''
  }

  static openContainer(node) {
    const container = node.querySelector('details')

    if (!container) return

    container.setAttribute('open', '')

    return container
  }

  static toggleContainer(node) {
    const container = node.querySelector('details')

    if (!container) return

    if (container.getAttribute('open') === '') {
      container.removeAttribute('open')
    } else {
      container.setAttribute('open', '')
    }

    return container
  }

  static onLoad(event) {
    event.stopPropagation()
    const button = event.target
    const article = button.closest('article')

    const payload = Item.PAYLOAD
    const current = Item.countChildNodes(article)
    const available = article.getAttribute('data-kids')
    const requested = available > payload ? available - current : available
    const remaining = requested > payload ? requested - payload : 0

    article.setAttribute('data-kids', remaining)

    if (remaining > 0) {
      button.textContent = `✛${remaining}`
    } else {
      button.remove()
    }

    Item.openContainer(article)
    const id = Number(article.getAttribute('id'))
    const loadEvent = View.loadEvent(current, payload, id)

    return article.dispatchEvent(loadEvent)
  }

  static onExpand(event) {
    event.stopPropagation()
    const article = event.target.closest('article')
    const loader = Item.queryLoader(article)

    Item.toggleContainer(article)

    if (!Item.countChildNodes(article) && !!loader) {
      loader.click()
    }
  }

  static onReply(event) {
    event.stopPropagation()
    const article = event.target.closest('article')

    // return and remove form, if it exists
    const replyForm = Item.queryReplyForm(article)
    if (replyForm) return replyForm.remove()

    // render form template
    const temp = document.getElementById('reply').content.cloneNode(true)
    const form = temp.querySelector('form')
    const id = article.getAttribute('id')
    form.setAttribute('action', `/reply/${id}`)

    const comment = Item.queryComment(article)
    const isPost = article.parentElement instanceof Page
    if (isPost && !comment) {
      // when post has no text, prepend to section top
      const section = article.querySelector('& > details > section')
      section.insertAdjacentElement('afterbegin', form)
    } else {
      comment.insertAdjacentElement('afterend', form)
    }

    if (isPost && !Item.isContainerOpen(article)) {
      Item.openContainer(article)
    }
  }

  static onVote(event) {
    event.stopPropagation()
    const button = event.target
    const article = button.closest('article')
    const vote = button.getAttribute('name')
    const id = article.getAttribute('id')
    fetch(`/${vote}/${id}`).then((res) => {
      if (res.ok) button.remove()
    })
  }

  static render(item) {
    const template = document.getElementById('item')
    const node = template.content.cloneNode(true)

    const article = node.querySelector('article')
    article.setAttribute('id', item.id)
    article.setAttribute('data-kids', item.kids.length)

    const title = node.querySelector('h1')
    if (item.title) {
      const link = node.querySelector('a')
      if (item.url) {
        link.setAttribute('href', item.url)
        link.textContent = item.title
        link.addEventListener('click', View.stopEvent)
      } else {
        link.remove()
        title.textContent = item.title
      }
      title.addEventListener('click', Item.onExpand)
    } else {
      title.remove()
    }

    const subtitle = node.querySelector('h2')

    const upvote = subtitle.querySelector('button[name="upvote"]')
    if (item.upvote) {
      upvote.addEventListener('click', Item.onVote)
    } else {
      upvote.remove()
    }

    const downvote = subtitle.querySelector('button[name="downvote"]')
    if (item.downvote) {
      downvote.addEventListener('click', Item.onVote)
    } else {
      downvote.remove()
    }

    const score = subtitle.querySelector('b')
    if (item.score) {
      score.textContent = `${item.score}`
    } else {
      score.remove()
    }

    const username = subtitle.querySelector('i')
    if (item.by) {
      username.textContent = `${item.by}`
    } else {
      username.remove()
    }

    const childCount = item.descendants || item.kids.length
    const labelCount = subtitle.querySelector('span')
    if (childCount) {
      labelCount.textContent = `🗨 ${childCount}`
    } else {
      labelCount.remove()
    }

    const age = subtitle.querySelector('time')
    if (item.time) {
      age.textContent = `⏲ ${View.age(item.time * 1000, Date.now())} `
      // expand details
      subtitle.addEventListener('click', Item.onExpand)
    } else {
      age.remove()
    }

    const reply = subtitle.querySelector('button[name="reply"]')
    if (item.reply) {
      reply.addEventListener('click', Item.onReply)
    } else {
      reply.remove()
    }

    // post text and branches
    const section = node.querySelector('section')

    if (item.text) {
      const comment = document.createElement('div')
      comment.innerHTML = item.text
      // process comment links
      comment.querySelectorAll('a')?.forEach((a) => a.setAttribute('target', '_blank'))
      // attach post body in section to collapse it
      if (item.type === 'comment') {
        subtitle.insertAdjacentElement('afterend', comment)
      } else {
        section.insertAdjacentElement('afterbegin', comment)
      }
    }

    if (item.kids.length) {
      const button = section.querySelector('button')
      button.textContent = `✛${item.kids.length}`
      button.addEventListener('click', Item.onLoad)
      section.insertAdjacentElement('beforeend', button)
    } else {
      node.querySelector('details').remove()
    }

    return node
  }
}
