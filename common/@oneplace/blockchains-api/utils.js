/** DEPRECATED */


const Remarkable = require('remarkable');
const md = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});
const decoder = require('html-entities').AllHtmlEntities;
const noop = function noop() {};
const DOMParser = require('xmldom').DOMParser;
const parser = new DOMParser({
  errorHandler: {warning: noop, error: noop}
});
const XMLSerializer = require('xmldom').XMLSerializer;
const serializer = new XMLSerializer();

const IMG_PREFIX = {
  s: 'https://steemitimages.com',
  g: 'https://imgp.golos.io'
};

const URL_PREFIX = {
  s: 'https://steemit.com',
  g: 'https://golos.io'
};


function cutLinks(str, length) {
  str = str.replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
  while ((str.indexOf("http") >= 0) && (str.indexOf("http") <= length)) {
    const start = str.indexOf("http");
    const part1 = str.substring(0, start);
    const end = str.indexOf(' ', start);
    if (end >= 0) {
      const part2 = str.substring(end);
    } else {
      const part2 = '';
    };
    str = part1 + part2;
  };
  return str;
};

function prepareHTML(text, media, metadata) {
  text = md.render(text);
  text = decoder.decode(text);
  const doc = parser.parseFromString(text, 'text/html');
  metadata = prepareForLinkify(metadata);
  traverseDOM(doc, doc, media, metadata);
  proxifyImages(doc, media);
  text = serializer.serializeToString(doc);
  return text;
}

function prepareForLinkify(metadata) {
  if (metadata.length) {
    const object = JSON.parse(metadata);
    const data = {};
    if (!object.image && object.images) {
      object.image = object.images
    }
    data.images = (object.image) ? object.image.filter(n => n) : [];
    data.links = (object.links) ? object.links.filter(n => n) : [];
    data.links.sort(function(a, b) {
      return (b.length - a.length);
    })
    data.videos = [];
    if (data.links) {
      for (let j = 0; j < data.links.length; j++) {
        if (data.links[j].match('https://youtu.be/') ||
          data.links[j].match('https://www.youtube.com/watch') ||
          data.links[j].match('https://m.youtube.com/watch')) {
          const link = {};
          link.href = data.links[j];
          link.type = 'youtube'
          if (link.href.substring(0, 30) == 'https://m.youtube.com/watch?v=') {
            link.id = link.href.substring(30, 41);
          }
          if (link.href.substring(0, 32) == 'https://www.youtube.com/watch?v=') {
            link.id = link.href.substring(32, 43);
          }
          if (link.href.substring(0, 17) == 'https://youtu.be/') {
            link.id = link.href.substring(17, 28);
          }
          data.videos.push(link);
          data.links.splice(j, 1);
          j--;
        } else {
          if (data.links[j].match('https://vimeo.com/') && (/\/\d{9}/i.test(data.links[j]))) {
            const link = {};
            link.href = data.links[j];
            link.type = 'vimeo'
            const pos = link.href.search(/\/\d{9}/i) + 1;
            link.id = link.href.substring(pos, pos + 9);
            data.videos.push(link);
            data.links.splice(j, 1);
            j--;
          };
        }
      }
    }
    return data;
  }
  return {
    images: [],
    links: [],
    videos: []
  };
}


function traverseDOM(document, node, media, metadata) {
  if (!node || !node.childNodes) return;
  const children = node.childNodes;

  [].forEach.call(children, function(child) {
    const tag = child.tagName ? child.tagName.toLowerCase() : null;

    if (tag === 'iframe')
      iframe(document, child)
    else if (tag === 'a')
      link(document, child)
    else
      linkifyNode(document, child, media, metadata)

    traverseDOM(document, child, media, metadata);
  })
}

function link(document, child) {
  const url = child.getAttribute('href')
  if (url) {
    if (! /^\/(?!\/)|(https?:)?\/\//.test(url)) {
      child.setAttribute('href', "https://" + url)
    }
  }
}

function iframe(document, child) {
  const tag = child.parentNode.tagName ? child.parentNode.tagName.toLowerCase() : child.parentNode.tagName;
  if (tag == 'div' && child.parentNode.getAttribute('class') == 'video-wrapper') return;
  let html = serializer.serializeToString(child);
  html = parser.parseFromString('<div class="video-wrapper">' + html + '</div>');
  if (child.parentNode == document) {
    const doc2 = document.cloneNode();
    doc2.replaceChild(html, child);
    //    document = doc2;  
    return;
  }
  child.parentNode.replaceChild(html, child);
  return;
}

function linkifyNode(document, child, media, metadata) {
  try {
    const tag = child.parentNode.tagName ? child.parentNode.tagName.toLowerCase() : child.parentNode.tagName;
    if (tag === 'code') return;
    if (tag === 'a') return;
    if (child.parentNode.parentNode && child.parentNode.parentNode.tagName && (child.parentNode.parentNode.tagName.toLowerCase() === 'a')) return;

    if (!child.data || child.data == '') return;
    let data = serializer.serializeToString(child);
    data = decoder.decode(data);
    const content = linkify(data, media, metadata);
    if (content !== data) {
      const newChild = parser.parseFromString('<span>' + content + '</span>');
      if (child.parentNode == document) {
        const doc2 = document.cloneNode();
        doc2.replaceChild(newChild, child);
        return;
      }
      child.parentNode.replaceChild(newChild, child);
      return;
    }
  } catch (error) {
    console.log('Error:' + error);
  }
}

const linksRe = require('./links')

function linkify(content, media, metadata) {
  // hashtags  
  content = content.replace(/(^|\s)(#[-a-zа-яё\d]+)/ig, function(tag) {
    if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
    const space = /^\s/.test(tag) ? tag[0] : '';
    tag = tag.trim();
    //        var tagLower = tag2.toLowerCase();
    return space + ('<span class="hashtag">' + tag + '</span>');
  });

  // usertag (mention)
  content = content.replace(/(^|\s)(@[a-z][-\.a-z\d]+[a-z\d])/ig, function(user) {
    const space = /^\s/.test(user) ? user[0] : '';
    const user2 = user.trim().substring(1);
    const userLower = user2.toLowerCase();
    const valid = validateAccountName(userLower) == null;
    return space + (valid ? '<a href="' + URL_PREFIX[media] + '/@' + userLower + '" target="_blank">@' + user2 + '</a>' : '@' + user2);
  });

  //images
  // if (metadata.images.length) {
  //   metadata.images.forEach(image => {
  //     content = content.replace(image, '<img src="' + image + '" alt="">');
  //   });
  // }

  // unmarked images
  content = content.replace(linksRe.imageFn('gi'), function(img) {
    const space = /^\s/.test(img) ? img[0] : '';
    return space + ('<img src="' + img + '" alt="">');
  });

  // videos
  if (metadata.videos.length) {
    metadata.videos.forEach(function(link) {
      content = (link.type == 'youtube') ? content.replace(link.href, ('<div class="video-wrapper"><iframe width="560" height="310" src="https://www.youtube.com/embed/' + link.id + '" frameborder="0" allowfullscreen></iframe></div>')) : content.replace(link.href, ('<div class="video-wrapper"><iframe src="https://player.vimeo.com/video/' + link.id + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>'));
    });
  }

  return content;
}

function validateAccountName(value) { //Basically copied from steem

  const suffix = 'Account name should ';
  if (!value) {
    return suffix + 'not be empty.';
  }
  const length = value.length;
  if (length < 3) {
    return suffix + 'be longer.';
  }
  if (length > 16) {
    return suffix + 'be shorter.';
  }
  if (/\./.test(value)) {
    suffix = 'Each account segment should ';
  }
  //    if (BadActorList.includes(value)) {
  //        return 'Use caution sending to this account. Please double check your spelling for possible phishing. ';
  //    }
  const ref = value.split('.');
  for (i = 0, i < ref.length; i++;) {
    const label = ref[i];
    if (!/^[a-z]/.test(label)) {
      return suffix + 'start with a letter.';
    }
    if (!/^[a-z0-9-]*$/.test(label)) {
      return suffix + 'have only letters, digits, or dashes.';
    }
    if (/--/.test(label)) {
      return suffix + 'have only one dash in a row.';
    }
    if (!/[a-z0-9]$/.test(label)) {
      return suffix + 'end with a letter or digit.';
    }
    if (!(label.length >= 3)) {
      return suffix + 'be longer';
    }
  }
  return null;
}


function proxifyImages(doc, media) {
  if (!IMG_PREFIX[media]) return;
  if (!doc) return;
  const nodes = doc.getElementsByTagName('img');
  [].forEach.call(nodes, function(node) {
    const url = node.getAttribute('src');
    node.setAttribute('src', IMG_PREFIX[media] + '/0x0/' + url);
  });
}

function log10(str) {
  const leadingDigits = parseInt(str.substring(0, 4));
  const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
  const n = str.length - 1;
  return n + (log - parseInt(log));
}

function convertReputation(rep2) {
  if (rep2 == null) return rep2;
  let rep = String(rep2);
  const neg = rep.charAt(0) === '-';
  rep = neg ? rep.substring(1) : rep;

  let out = log10(rep);
  if (isNaN(out)) out = 0;
  out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
  out = (neg ? -1 : 1) * out;
  out = out * 9 + 25; // 9 points per magnitude. center at 25
  // base-line 0 to darken and < 0 to auto hide (grep rephide)
  out = parseInt(out);
  return out;
}

module.exports.cutLinks = cutLinks;
module.exports.prepareHTML = prepareHTML;
module.exports.convertReputation = convertReputation;
