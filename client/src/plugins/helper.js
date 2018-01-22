
export default class Helper {
  static install(Vue) {
    Vue.prototype.$helper = new Helper()
    this.vue = Vue.prototype
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
  
  generateAppMeta($route){
    const TITLE = 'Your daily dose of blockchain'
    const DESCRIPTION =
      'Blockchain aggregator that selects best content from Golos and Steem and delivers it to users with user-friendly and modern interface'
    const IMAGE = 'https://oneplace.media/static/img/poster.jpeg'
    return {
      title: TITLE,
      titleTemplate: '%s | OnePlace.media',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: DESCRIPTION
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: `${TITLE} | OnePlace.media`
        },
        { vmid: 'og:type', property: 'og:type', content: 'website' },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: `https://oneplace.media${$route.path}`
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content: IMAGE
        },
        {
          vmid: 'og:image:width',
          property: 'og:image:width',
          content: '840'
        },
        {
          vmid: 'og:image:height',
          property: 'og:image:height',
          content: '362'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: DESCRIPTION
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'OnePlace.media'
        },
        {
          vmid: 'twitter:image',
          name: 'twitter:image',
          content: IMAGE
        },
        {
          vmid: 'twitter:card',
          name: 'twitter:site',
          content: '@oneplace.media'
        },
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: `${TITLE} | OnePlace.media`
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content: DESCRIPTION
        }
      ]
    }
  }

  generatePostMeta(post, $route){
    const IMAGE = process.env.BASE_API_URL + `img?l=${encodeURIComponent(post.image)}`
    return {
      title: post.title,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: post.preview
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: post.title + ' | OnePlace.media'
        },
        { vmid: 'og:type', property: 'og:type', content: 'article' },
        {
          vmid: 'article:tag',
          property: 'article:tag',
          content: post.category
        },
        {
          vmid: 'article:published_time',
          property: 'article:published_time',
          content: post.created
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: `https://oneplace.media${$route.path}`
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content: IMAGE
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: post.preview
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'OnePlace.media'
        },
        {
          vmid: 'twitter:image',
          name: 'twitter:image',
          content: IMAGE
        },
        {
          vmid: 'twitter:card',
          name: 'twitter:site',
          content: '@oneplace.media'
        },
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: post.title + ' | OnePlace.media'
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content: post.preview
        }
      ]
    }
  }
}
