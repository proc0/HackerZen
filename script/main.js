window.onload = function () {
  const TAG_VIEW = 'hz-view'
  customElements.define(TAG_VIEW, View, { extends: 'main' })
  const main = document.createElement('main', { is: TAG_VIEW }).initialize()

  document.querySelector('body').prepend(main)
}
