const formidable = require('formidable')
const fs = require('fs')
const uuid = require('uuid/v4')
const exec = require('child_process').exec
const STORAGE_PATH = [__dirname, '../storage'].join('/')
const {promisify} = require('util')
const imageSize = promisify(require('image-size'))

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
        const [type, subType] = files.image.type.split('/')
        if (dimension.width > MAX_IMAGE_WIDTH || dimension.height > MAX_IMAGE_HEIGHT) {
          if (type === 'gif') {

          } else {

          }
        }
      })
  }

  async function moveFile(image) {
    const pathObj = await makeNewPath(image)
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

  Model.upload = async function(req) {
    const files = await parseFilesInForm(req)
    if (!files.image) throw new Error('File not found')
    const [type, subType] = files.image.type.split('/')

    if (type !== 'image') throw new Error('Upload file must have type like image/*')
    if (!~['gif', 'png', 'jpeg', 'webp'].indexOf(subType)) throw new Error(`Only gif, png, jpeg, webp support`)
    if (subType !== 'gif' && files.image.size > MAX_UPLOAD_SIZE) throw new Error('Upload file size must less then 2Mb')
    if (subType === 'gif' && files.image.size > MAX_UPLOAD_SIZE_GIF) throw new Error('Upload file size must less then 2Mb')
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