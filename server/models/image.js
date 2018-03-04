const formidable = require('formidable')
const fs = require('fs')
const uuid = require('uuid/v4')
const exec = require('child_process').exec
const STORAGE_PATH = [__dirname, '../storage'].join('/')
const {promisify} = require('util')
const imageSize = promisify(require('image-size'))
const sharp = require('sharp')
const gifsicle = require('gifsicle')

module.exports = Model => {
  const MAX_UPLOAD_SIZE = 4 * 1024 * 1024
  const MAX_UPLOAD_SIZE_GIF = 20 * 1024 * 1024
  const MAX_IMAGE_WIDTH = 1680
  const MAX_IMAGE_HEIGHT = 1200

  function parseFilesInForm(req) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve(files)
      })
    })
  }

  function makeNewPath(image) {
    return new Promise((resolve, reject) => {
      const hash = uuid().split('-')
      const fileName = [hash.pop(), image.name.split('.').pop()].join('.')
      const dir = hash.map(str => str.substr(0, 2)).join('/')
      const relPath = [dir, fileName].join('/')
      const absPath = [STORAGE_PATH, relPath].join('/')
      const pathObj = {
        fileName,
        dir,
        relPath,
        absPath
      }

      fs.access(absPath, fs.R_OK | fs.W_OK, err => {
        if (err) {
          const dirAsb = [STORAGE_PATH, dir].join('/')
          fs.access(dirAsb, fs.R_OK | fs.W_OK, err => {
            if (err) {
              exec('mkdir -p ' + dirAsb, err => {
                if (err) reject(err)
                else resolve(pathObj)
              })
            } else resolve(pathObj)
          })
        } else resolve(makeNewPath(image))
      })
    })
  }

  function optmizeImage(image) {
    return imageSize(image.path)
      .then(dimension => {
        const [type, subType] = image.type.split('/')
        if (dimension.width > MAX_IMAGE_WIDTH || dimension.height > MAX_IMAGE_HEIGHT) {
          const newPath = image.path + '-opt'
          if (subType === 'gif') {
            return new Promise((resolve, reject) => {
              const scale = dimension.width > MAX_IMAGE_WIDTH
                ? MAX_IMAGE_WIDTH / dimension.width
                : MAX_IMAGE_HEIGHT / dimension.height
              exec([gifsicle, `--scale ${scale}`, `-i ${image.path}`, `> ${newPath}`].join(' '), err => {
                if (err) reject(err)
                else resolve(newPath)
              })
            })
          } else {
            return sharp(image.path)
              .resize(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT)
              .max()
              .toFile(newPath)
              .then(() => newPath)
          }
        }
      })
      .then(newPath => {
        image.path = newPath || image.path
        return image
      })
  }

  async function moveFile(image) {
    image = await optmizeImage(image)
    let pathObj = await makeNewPath(image)
    return new Promise((resolve, reject) => {
      fs.rename(image.path, pathObj.absPath, err => {
        if (err) reject(err)
        else {
          delete pathObj.absPath
          resolve(pathObj)
        }
      })
    })
  }

  const ERRORS = {
    TYPE: {code: 'TYPE', msg: 'Upload file must have type like image/*'},
    SUPPORT: {code: 'SUPPORT', msg: 'Only gif, png, jpeg, webp support'},
    SIZE_GIF: {code: 'SIZE_GIF', msg: 'Upload file size must less then 20Mb'},
    SIZE: {code: 'SIZE', msg: 'Upload file size must less then 2Mb'}
  }
  Model.upload = async function(req) {
    const files = await parseFilesInForm(req)
    if (!files.image) throw new TypeError('File not found')
    const [type, subType] = files.image.type.split('/')

    try {
      if (type !== 'image') throw new TypeError(ERRORS.TYPE.code)
      if (!~['gif', 'png', 'jpeg', 'webp'].indexOf(subType)) throw new TypeError(ERRORS.SUPPORT.code)
      if (subType !== 'gif' && files.image.size > MAX_UPLOAD_SIZE) throw new TypeError(ERRORS.SIZE.code)
      if (subType === 'gif' && files.image.size > MAX_UPLOAD_SIZE_GIF) throw new TypeError(ERRORS.SIZE_GIF.code)
    } catch (e) {
      e.code = ERRORS[e.message].code
      e.message = ERRORS[e.message].msg
      e.statusCode = 400
      throw e
    }

    const pathObj = await moveFile(files.image)
    return pathObj
  }

  Model.remoteMethod('upload', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}}
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/upload', verb: 'post'}
  })
}