module.exports = Model => {
  Model.validate('title', function(inValid) {if (this.title && this.title.length > 255) inValid()}, {message: 'Title must be less then 255'})

  Model.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      ctx.instance.userId = ctx.options.accessToken.userId
      ctx.instance.time = Math.floor(new Date().getTime() / 1000)
    } else
      ctx.data.time = Math.floor(new Date().getTime() / 1000)

    next()
  })
}