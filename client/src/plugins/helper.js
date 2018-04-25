
export default class Helper {
  static install(Vue) {
    Vue.prototype.$helper = new Helper()
  }

  makePathForPost(post, chain) {
    return `/${chain}/@${post.author}/${post.permlink}`
  }

  handleValidationError(errorsFromResponse, errors) {
    const codes = errorsFromResponse.details.codes
    const messages = errorsFromResponse.details.messages
    Object.keys(codes).forEach(field => {
      codes[field].forEach((rule, index) => {
        errors.add({
          field,
          rule,
          scope: rule,
          id: [field, rule].join(),
          msg: messages[field][index]
        })
      })
    })
  }

  videoWrapperHandler() {
    const videoWrappers = document.getElementsByClassName('video-wrapper')
    for (let i = 0, len = videoWrappers.length; i < len; i++) {
      let videoWrapper = videoWrappers[i]
      if (videoWrapper.dataset.ready !== '1') {
        videoWrapper.dataset.ready = '1'
        const iframe = document.createElement('IFRAME')
        iframe.src = videoWrapper.dataset.src
        iframe.width = 560
        iframe.height = 310
        iframe.frameBorder = 0
        iframe.setAttribute('allowfullscreen', '')
        videoWrapper.appendChild(iframe)
      }
    }
  }

  toggleBodyModalClass({flag}) {
    if (flag) document.body.classList.add('modal-shown')
    else document.body.classList.remove('modal-shown')
  }

  filterPostByTags({posts, include, exclude}) {
    return posts.filter(post => {
      let result = true
      if (Object.keys(include).length && Object.keys(exclude).length)
        result =
          post.tags.every(tag => !exclude[tag]) &&
          post.tags.some(tag => include[tag])
      else if (Object.keys(include).length)
        result = post.tags.some(tag => include[tag])
      else if (Object.keys(exclude).length)
        result = post.tags.every(tag => !exclude[tag])
      return result
    })
  }
}
