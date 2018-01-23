const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

const app = express()

let renderer
if (isProd) {
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync(resolve('./dist/index.html'), 'utf-8')
  renderer = createRenderer(bundle, template)
} else {
  require('./build/dev-server')(app, (bundle, template) => {
    renderer = createRenderer(bundle, template)
  })
}


function createRenderer(bundle, template) {
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    template,
    runInNewContext: 'once',
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

app.use('/static', serve('./static', true))
app.use('/dist', serve('./dist', true))
// app.use(require('cookie-parser')())
app.use(favicon(path.resolve(__dirname, 'static/favicon.ico')))
// app.use('/service-worker.js', serve('./dist/service-worker.js'))


app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  const s = Date.now()

  res.setHeader("Content-Type", "text/html")

  const errorHandler = err => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).end('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
  }
  const context = {
    url: req.url
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err && err.code === 404) {
        res.status(404).end('404 | Not Found')
      } else {
        // Render Error Page or Redirect
        res.status(500).end('500 | Internal Server Error')
        console.error(`error during render : ${req.url}`)
        console.error(err)
      }
    } else {
      if (~html.indexOf('error-block--404-key')) {
        res.status(404)
      }
      res.end(html)
    }
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  app.emit('server-ready')
  console.log(`server started at http://localhost:${port}`)
  setTimeout(() => process.send('ready'), 2000)

})


process.on('message', function(msg) {
  if (msg === 'shutdown') {
    app.close(() => process.exit(0))
  }
})

module.exports = app