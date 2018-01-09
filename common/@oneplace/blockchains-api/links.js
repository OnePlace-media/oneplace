const CONFIG = require('../../../server/config.json')
const APP_DOMAIN = CONFIG.origin.replace('http', '').replace('https://', '')
const urlChar = '[^\\s"<>\\]\\[\\(\\)]'
const urlCharEnd = urlChar.replace(/\]$/, '.,\']')
const imagePath = '(?:(?:\\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs/[a-z\\d]{40,}))'
const domainPath = '(?:[-a-zA-Z0-9\\._]*[-a-zA-Z0-9])'
const urlChars = '(?:' + urlChar + '*' + urlCharEnd + ')?'

const urlSet = ({domain = domainPath, path} = {}) => {
  return `https?:\/\/${domain}(?::\\d{2,5})?(?:[/\\?#]${urlChars}${path ? path : ''})${path ? '' : '?'}`
}

const any = (flags = 'i') => new RegExp(urlSet(), flags)
const youTube = (flags = 'i') => new RegExp(urlSet({domain: '(?:(?:.*\.)?youtube.com|youtu.be)'}), flags)
const image = (flags = 'i') => new RegExp(urlSet({path: imagePath}), flags)
const imageFile = (flags = 'i') => new RegExp(imagePath, flags)
const local = (flags = 'i') => new RegExp(urlSet({domain: '(?:localhost|(?:.*\\.)?' + APP_DOMAIN + ')'}), flags)

module.exports = {
  local: local(),
  any: any(),
  anyFn: any,
  image: image(),
  imageFn: image,
  imageFile: imageFile(),
  youTube: youTube(),
  youTubeId: /(?:(?:youtube.com\/watch\?v=)|(?:youtu.be\/)|(?:youtube.com\/embed\/))([A-Za-z0-9\_\-]+)/i,
  vimeoId: /(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)/,
  ipfsPrefix: /(https?:\/\/.*)?\/ipfs/i,
  embedContent: /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?^=%:/~+#-]*[\w@?^=%/~+#-])?/i,
}