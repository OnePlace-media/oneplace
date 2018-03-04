module.exports = STORAGE => {
  const CONSTANTS = require('@oneplace/constants')
  const request = require('request')
  const fs = require('fs')

  describe('Image Upload', function() {
    describe('Upload good', function() {
      ['png', 'jpg', 'gif'].forEach(type => {
        it(`Upload image-good ${type}`, function(done) {
          request({
            method: 'POST',
            url: 'http://localhost:3001/api/images/upload',
            json: true,
            formData: {
              image: fs.createReadStream(__dirname + `/../data/img_good.${type}`)
            }
          }, (err, res, body) => {
            body.should.be.a('object')
            body.should.have.property('fileName')
            body.should.have.property('relPath')
            done()
          })
        })
      })
    })

    describe('Upload big, optimization', function() {
      ['png', 'jpg', 'gif'].forEach(type => {
        it(`Upload image-big ${type}`, function(done) {
          request({
            method: 'POST',
            url: 'http://localhost:3001/api/images/upload',
            json: true,
            formData: {
              image: fs.createReadStream(__dirname + `/../data/img_big.${type}`)
            }
          }, (err, res, body) => {
            body.should.be.a('object')
            body.should.have.property('fileName')
            body.should.have.property('relPath')
            done()
          })
        })
      })
    })

    describe('Upload big very, catch error', function() {
      ['jpg'].forEach(type => {
        it(`Upload image-big-very ${type}, catch error`, function(done) {
          request({
            method: 'POST',
            url: 'http://localhost:3001/api/images/upload',
            json: true,
            formData: {
              image: fs.createReadStream(__dirname + `/../data/img_big_very.${type}`)
            }
          }, (err, res, body) => {
            res.statusCode.should.be.eql(400)
            body.should.be.a('object')
            body.error.should.be.a('object')
            body.error.code.should.be.eql('SIZE')
            done()
          })
        })
      })
    })

    describe('Upload bad format, catch error', function() {
      it(`Upload img.bmp, catch error`, function(done) {
        request({
          method: 'POST',
          url: 'http://localhost:3001/api/images/upload',
          json: true,
          formData: {
            image: fs.createReadStream(__dirname + `/../data/img.bmp`)
          }
        }, (err, res, body) => {
          res.statusCode.should.be.eql(400)
          body.should.be.a('object')
          body.error.should.be.a('object')
          body.error.code.should.be.eql('SUPPORT')
          done()
        })
      })
    })
  })
}