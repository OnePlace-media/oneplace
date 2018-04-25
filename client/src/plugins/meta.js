import CONSTANTS from '@oneplace/constants'
import {unGolosTag} from '../filters/golos.tag'
export default class Meta {
  static install(Vue) {
    Vue.prototype.$metaGenerator = new Meta()
  }

  app($route) {
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
        {vmid: 'og:type', property: 'og:type', content: 'website'},
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

  profile(account, $route) {
    const BC = $route.params.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ? 'STEEM' : 'GOLOS'
    const profile = account.meta && account.meta.profile ? account.meta.profile : {}
    const IMAGE = profile.profile_image ? process.env.BASE_API_URL + `img?l=${encodeURIComponent(profile.profile_image)}` : CONSTANTS.DEFAULT.AVATAR_IMAGE
    const username = $route.params.username
    return {
      title: `@${username} | ${BC}`,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: profile.about
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: username + ' | OnePlace.media'
        },
        {vmid: 'og:type', property: 'og:type', content: 'profile'},
        {
          vmid: 'profile:username',
          property: 'profile:username',
          content: username
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
          content: profile.about
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
          content: username + ' | OnePlace.media'
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content: account.about
        }
      ]
    }
  }

  post(post, $route) {
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
        {vmid: 'og:type', property: 'og:type', content: 'article'},
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

  tag(tag, $route, chainName) {
    const tagName = unGolosTag(tag)
    const TITLE = tagName + ' | ' + chainName + '| OnePlace.media'
    let DESCRIPTION = `The most trendy and recent posts with the ${tagName.toLowerCase()} tag, ${chainName} blockchain.`

    if ($route.params.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS)
      DESCRIPTION = `Самые трендовые и свежие посты в категории ${tagName.toLowerCase()}, ${chainName} блокчейн.`

    return {
      title: TITLE,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: DESCRIPTION
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: TITLE
        },
        {vmid: 'og:type', property: 'og:type', content: 'article'},
        {
          vmid: 'article:tag',
          property: 'article:tag',
          content: TITLE
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: `https://oneplace.media${$route.path}`
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
          vmid: 'twitter:card',
          name: 'twitter:site',
          content: '@oneplace.media'
        },
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: TITLE
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content: DESCRIPTION
        }
      ]
    }
  }
  feed($route) {
    const BC = $route.params.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ? 'STEEM' : 'GOLOS'
    const username = $route.params.username
    const TITLE = `Feed ${username} | ${BC} | OnePlace.media`
    return {
      title: TITLE,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: ''
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: TITLE
        },
        {vmid: 'og:type', property: 'og:type', content: 'profile'},
        {
          vmid: 'profile:username',
          property: 'profile:username',
          content: username
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: `https://oneplace.media${$route.path}`
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'OnePlace.media'
        },
        {
          vmid: 'twitter:card',
          name: 'twitter:site',
          content: '@oneplace.media'
        },
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: TITLE
        }
      ]
    }
  }
}