const Remarkable = require('remarkable');
const md = new Remarkable({
  html: true,
  breaks: true,
  linkify: false,
  typographer: false,
  quotes: '“”‘’'
})
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()
const xmldom = require('xmldom')
const DOMParser = new xmldom.DOMParser({
  errorHandler: {warning: () => {}, error: () => {}}
})
const XMLSerializer = new xmldom.XMLSerializer()


function traverse(chain, node, state, depth = 0) {
  if (!node || !node.childNodes) return
  Object.keys(node.childNodes).forEach(key => {
    const child = node.childNodes[key]
    const tag = child.tagName ? child.tagName.toLowerCase() : null
    if (tag) state.htmltags.add(tag)
    if (tag === 'img') img(state, child)
    else if (tag === 'iframe') iframe(state, child)
    else if (tag === 'a') link(chain, state, child)
    else if (child.nodeName === '#text') linkifyNode(chain, child, state);
    traverse(chain, child, state, depth + 1)
  })
}

function img(state, child) {
  const url = child.getAttribute('src')
  if (url) {
    state.images.add(url)
  }
}

function iframe(state, child) {
  const url = child.getAttribute('src')
  if (url) {
    const {images, links} = state
    const yt = youTubeId(url)
    if (yt && images && links) {
      links.add(yt.url)
      images.add('https://img.youtube.com/vi/' + yt.id + '/0.jpg')
    }
  }

  const tag = child.parentNode.tagName
    ? child.parentNode.tagName.toLowerCase()
    : child.parentNode.tagName
  if (
    tag == 'div' &&
    child.parentNode.getAttribute('class') == 'videoWrapper'
  )
    return
  const html = XMLSerializer.serializeToString(child)
  child.parentNode.replaceChild(
    DOMParser.parseFromString(`<div class="videoWrapper">${html}</div>`),
    child
  )
}

function link(chain, state, child) {
  const url = child.getAttribute('href');
  if (url) {
    state.links.add(url);
    if (!/^((#)|(\/(?!\/))|((https?:)?\/\/))/.test(url)) {
      child.setAttribute('href', 'https://' + url)
    }

    // const accountRegExp = /^((http|https):\/\/)?(golos\.io|steemit\.com)?\/(@[-a-zA-Z0-9]+)$/
    // if (accountRegExp.test(url)) {
    //   const matched = url.match(accountRegExp)
    //   const username = matched[4]
    //   const domain = matched[3]
    //   if (domain === 'golos.io')
    //     chain = 'g'
    //   else if (domain === 'steemit.com')
    //     chain = 's'

    //   child.setAttribute('href', `/${chain}/${username}`)
    // }

    const atricleRegExp = /^((http|https):\/\/)?(golos\.blog|golos\.io|steemit\.com)?(\/[-a-zA-Z0-9]+)?\/(@[-\.a-zA-Z0-9]+)\/([-a-zA-Z0-9]+)$/
    if (atricleRegExp.test(url)) {
      const matched = url.match(atricleRegExp)
      const domain = matched[3]
      const username = matched[5]
      const permlink = matched[6]
      if (~['golos.io', 'golos.blog'].indexOf(domain))
        chain = 'g'
      else if (domain === 'steemit.com')
        chain = 's'

      child.setAttribute('href', `/${chain}/${username}/${permlink}`)
    }
  }
}

const linksRe = require('./links')
function linkify(chain, content, hashtags, usertags, images, links) {
  content = content.replace(/(^|\s)(#[-a-z\d]+)/gi, tag => {
    if (/#[\d]+$/.test(tag)) return tag
    const space = /^\s/.test(tag) ? tag[0] : ''
    const tag2 = tag.trim().substring(1)
    const tagLower = tag2.toLowerCase()
    if (hashtags) hashtags.add(tagLower)
    return space + `<a href="/trending/${tagLower}" target="_blank">${tag}</a>`
  })

  content = content.replace(
    /(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/]))[@＠]([a-z][-\.a-z\d]+[a-z\d])/gi,
    (match, preceeding1, preceeding2, user) => {
      const userLower = user.toLowerCase()
      const valid = true // validate_account_name(userLower) == null

      if (valid && usertags) usertags.add(userLower)

      const preceedings = (preceeding1 || '') + (preceeding2 || '')
      return valid
        ? `${preceedings}<a href="/${chain}/@${userLower}">@${user}</a>`
        : `${chain}/@` + user
    }
  );

  content = content.replace(linksRe.anyFn('gi'), ln => {
    if (linksRe.image.test(ln)) {
      if (images) images.add(ln);
      return `<img src="${ln}" />`
    }
    if (/\.(zip|exe)$/i.test(ln)) return ln
    if (links) links.add(ln)
    return `<a href="${ln}" target="_blank">${ln}</a>`
  });
  return content
}

function embedYouTubeNode(child, links, images) {
  try {
    if (!child.data) return false
    const data = child.data
    const yt = youTubeId(data)
    if (!yt) return false

    const v = DOMParser.parseFromString(`
      <div class="video-wrapper">
        <iframe width="560" height="310" src="https://www.youtube.com/embed/${yt.id}" frameborder="0" allowfullscreen></iframe>
      </div>`
    )
    child.parentNode.replaceChild(v, child)
    if (links) links.add(yt.url)
    if (images)
      images.add('https://img.youtube.com/vi/' + yt.id + '/0.jpg')
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

function youTubeId(data) {
  if (!data) return null

  const m1 = data.match(linksRe.youTube)
  const url = m1 ? m1[0] : null
  if (!url) return null

  const m2 = url.match(linksRe.youTubeId)
  const id = m2 && m2.length >= 2 ? m2[1] : null
  if (!id) return null

  return {id, url}
}

function embedVimeoNode(child, links /*images*/) {
  try {
    if (!child.data) return false
    const data = child.data

    let id
    {
      const m = data.match(linksRe.vimeoId)
      id = m && m.length >= 2 ? m[1] : null
    }
    if (!id) return false

    const url = `https://player.vimeo.com/video/${id}`
    const v = DOMParser.parseFromString(`
      <div class="video-wrapper">
        <iframe width="560" height="310" src="${url}" frameborder="0" allowfullscreen></iframe>
      </div>
  `)
    child.parentNode.replaceChild(v, child)
    if (links) links.add(url)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

function linkifyNode(chain, child, state) {
  try {
    const tag = child.parentNode.tagName
      ? child.parentNode.tagName.toLowerCase()
      : child.parentNode.tagName
    if (tag === 'code') return
    if (tag === 'a') return

    if (!child.data) return
    if (embedYouTubeNode(child, state.links, state.images)) return
    if (embedVimeoNode(child, state.links, state.images)) return

    const data = XMLSerializer.serializeToString(child)
    const content = linkify(
      chain,
      data,
      state.hashtags,
      state.usertags,
      state.images,
      state.links
    );
    if (content !== data) {
      const newChild = DOMParser.parseFromString(
        `<span>${content}</span>`
      );
      child.parentNode.replaceChild(newChild, child)
      return newChild
    }
  } catch (error) {
    console.log(error)
  }
}

const IMG_PREFIX = {
  s: 'https://steemitimages.com',
  g: 'https://imgp.golos.io'
}

function proxifyImages(chain, doc) {
  if (!doc) return
  Array.prototype.slice.call(doc.getElementsByTagName('img')).forEach(node => {
    const url = node.getAttribute('src')
    if (!linksRe.local.test(url))
      node.setAttribute('src', [IMG_PREFIX[chain], '0x0', url].join('/'))
  })
}

function log10(str) {
  const leadingDigits = parseInt(str.substring(0, 4));
  const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
  const n = str.length - 1;
  return n + (log - parseInt(log));
}

class Parser {
  static prepareHTML(chain, body, metadata) {
    const state = {
      hashtags: new Set(),
      usertags: new Set(),
      htmltags: new Set(),
      images: new Set(),
      links: new Set()
    }
    body = body.replace(/&amp;(mdash|rdquo|ndash|ldquo|laquo|raquo|zwj)/g, string => string.replace(/&amp;/, '&'))
    const html = md.render(entities.decode(body))
    try {
      const doc = DOMParser.parseFromString(html, 'text/html');
      traverse(chain, doc, state)
      proxifyImages(chain, doc)
      return {
        html: doc ? XMLSerializer.serializeToString(doc) : '',
        ...state,
      }
    } catch (error) {
      console.log(
        'rendering error',
        JSON.stringify({error: error.message, html})
      )
      return {html: ''}
    }
  }

  static convertReputation(rep2) {
    if (rep2 == null) return rep2
    let rep = String(rep2)
    const neg = rep.charAt(0) === '-'
    rep = neg ? rep.substring(1) : rep
    let out = log10(rep)
    if (isNaN(out)) out = 0
    out = Math.max(out - 9, 0)
    out = (neg ? -1 : 1) * out
    out = out * 9 + 25
    out = parseInt(out)
    return out
  }

  static cutLinks(str, length) {
    str = str.replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ')
    while ((str.indexOf("http") >= 0) && (str.indexOf("http") <= length)) {
      const start = str.indexOf("http")
      const part1 = str.substring(0, start)
      const end = str.indexOf(' ', start)
      const part2 = end >= 0 ? str.substring(end) : ''
      str = part1 + part2
    }
    return str
  }
}


module.exports = Parser