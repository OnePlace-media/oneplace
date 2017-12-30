var Remarkable = require('remarkable');
var md = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});
var decoder = require('html-entities').AllHtmlEntities;
var noop = function noop() {};
var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser({
  errorHandler: {warning: noop, error: noop}
});
var XMLSerializer = require('xmldom').XMLSerializer;
var serializer = new XMLSerializer();

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
    var start = str.indexOf("http");
    var part1 = str.substring(0, start);
    var end = str.indexOf(' ', start);
    if (end >= 0) {
      var part2 = str.substring(end);
    } else {
      var part2 = '';
    };
    str = part1 + part2;
  };
  return str;
};

function prepareHTML(text, media, metadata) {

  text = md.render(text);
  text = decoder.decode(text);
  var doc = parser.parseFromString(text, 'text/html');
  metadata = prepareForLinkify(metadata);
  traverseDOM(doc, doc, media, metadata);
  proxifyImages(doc, media);
  text = serializer.serializeToString(doc);
  return text;
}

function prepareForLinkify(metadata) {
  if (metadata.length) {
    var object = JSON.parse(metadata);
    var data = {};
    if (!object.image && object.images) {
      object.image = object.images
    }
    data.images = (object.image) ? object.image.filter(function(n) {return n != ''}) : [];
    data.links = (object.links) ? object.links.filter(function(n) {return n != ''}) : [];
    data.links.sort(function(a, b) {
      return (b.length - a.length);
    })
    data.videos = [];
    if (data.links) {
      for (var j = 0; j < data.links.length; j++) {
        if (data.links[j].match('https://youtu.be/') ||
          data.links[j].match('https://www.youtube.com/watch') ||
          data.links[j].match('https://m.youtube.com/watch')) {
          var link = {};
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
            var link = {};
            link.href = data.links[j];
            link.type = 'vimeo'
            var pos = link.href.search(/\/\d{9}/i) + 1;
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
  //  console.log('Traversing this node: ' + node);
  if (!node || !node.childNodes) return;
  var children = node.childNodes;

  [].forEach.call(children, function(child) {
    var tag = child.tagName ? child.tagName.toLowerCase() : null;
    if ((child.nodeName != '#text') && (child.getAttribute('style'))) {
      console.log(child.getAttribute('style'));
    };
    if (tag === 'iframe') {
      iframe(document, child)
    };
    if (child.nodeName === '#text') linkifyNode(document, child, media, metadata);
    traverseDOM(document, child, media, metadata);
  });
  return;
}

function iframe(document, child) {
  var tag = child.parentNode.tagName ? child.parentNode.tagName.toLowerCase() : child.parentNode.tagName;
  if (tag == 'div' && child.parentNode.getAttribute('class') == 'video-wrapper') return;
  var html = serializer.serializeToString(child);
  html = parser.parseFromString('<div class="video-wrapper">' + html + '</div>');
  if (child.parentNode == document) {
    var doc2 = document.cloneNode();
    doc2.replaceChild(html, child);
    //    document = doc2;  
    return;
  }
  child.parentNode.replaceChild(html, child);
  return;
}

function linkifyNode(document, child, media, metadata) {
  try {
    var tag = child.parentNode.tagName ? child.parentNode.tagName.toLowerCase() : child.parentNode.tagName;
    if (tag === 'code') return;
    if (tag === 'a') return;
    if (child.parentNode.parentNode && child.parentNode.parentNode.tagName && (child.parentNode.parentNode.tagName.toLowerCase() === 'a')) return;

    if (!child.data || child.data == '') return;
    var data = serializer.serializeToString(child);
    data = decoder.decode(data);
    var content = linkify(data, media, metadata);
    if (content !== data) {
      var newChild = parser.parseFromString('<span>' + content + '</span>');
      if (child.parentNode == document) {
        var doc2 = document.cloneNode();
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

function linkify(content, media, metadata) {

  // hashtags  
  content = content.replace(/(^|\s)(#[-a-zа-яё\d]+)/ig, function(tag) {
    if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
    var space = /^\s/.test(tag) ? tag[0] : '';
    var tag = tag.trim();
    //        var tagLower = tag2.toLowerCase();
    return space + ('<span class="hashtag">' + tag + '</span>');
  });

  // usertag (mention)
  content = content.replace(/(^|\s)(@[a-z][-\.a-z\d]+[a-z\d])/ig, function(user) {
    var space = /^\s/.test(user) ? user[0] : '';
    var user2 = user.trim().substring(1);
    var userLower = user2.toLowerCase();
    var valid = validateAccountName(userLower) == null;
    return space + (valid ? '<a href="' + URL_PREFIX[media] + '/@' + userLower + '" target="_blank">@' + user2 + '</a>' : '@' + user2);
  });

  //images
  if (metadata.images.length) {
    metadata.images.forEach(function(image) {
      //          var n = image.lastIndexOf("/");
      //          var filename = image.substring(n+1);
      content = content.replace(image, ('<img src="' + image + '" alt="">'));
    });
  }

  //unmarked images
  content = content.replace(/(^|\s)(https?:\/\/.*\.^\s(?:png|jpg|jpeg|gif|png|svg))/ig, function(img) {
    var space = /^\s/.test(img) ? img[0] : '';
    return space + ('<img src="' + img + '" alt="">');
  });

  //links
  if (metadata.links.length) {
    metadata.links.forEach(function(link) {
      var src = 'src="';
      var href = 'href="';
      if (!content.match(src) && !content.match(href)) {
        content = content.replace(link, ('<a href="' + link + '" target="_blank">' + link + '</a>'));
      }
    });
  }

  // videos
  if (metadata.videos.length) {
    metadata.videos.forEach(function(link) {
      content = (link.type == 'youtube') ? content.replace(link.href, ('<div class="video-wrapper"><iframe width="560" height="310" src="https://www.youtube.com/embed/' + link.id + '" frameborder="0" allowfullscreen></iframe></div>')) : content.replace(link.href, ('<div class="video-wrapper"><iframe src="https://player.vimeo.com/video/' + link.id + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>'));
    });
  }

  return content;
}

function validateAccountName(value) { //Basically copied from steem

  var suffix = 'Account name should ';
  if (!value) {
    return suffix + 'not be empty.';
  }
  var length = value.length;
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
  var ref = value.split('.');
  for (i = 0, i < ref.length; i++;) {
    var label = ref[i];
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
  var nodes = doc.getElementsByTagName('img');
  [].forEach.call(nodes, function(node) {
    var url = node.getAttribute('src');
    node.setAttribute('src', IMG_PREFIX[media] + '/0x0/' + url);
  });
}

function log10(str) {
  var leadingDigits = parseInt(str.substring(0, 4));
  var log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
  var n = str.length - 1;
  return n + (log - parseInt(log));
}

function convertReputation(rep2) {
  if (rep2 == null) return rep2;
  var rep = String(rep2);
  var neg = rep.charAt(0) === '-';
  rep = neg ? rep.substring(1) : rep;

  var out = log10(rep);
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
