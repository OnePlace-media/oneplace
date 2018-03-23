module.exports = Model => {
  Model.validatesLengthOf('title', {max: 255})

  Model.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      ctx.instance.userId = ctx.options.accessToken.userId
      ctx.instance.time = Math.floor(new Date().getTime() / 1000)
    } else
      ctx.data.time = Math.floor(new Date().getTime() / 1000)

    next()
  })
}