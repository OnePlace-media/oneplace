const ROLE = {
  user: 1,
  admin: 2
}

module.exports = (Model, options) => {
  Model.beforeRemote('prototype.patchAttributes', (ctx, unused, next) => {
    const User = Model.app.models.user;
    const Role = Model.app.models.Role;
    Role.isInRole(ROLE.ADMIN, {accessToken: ctx.req.accessToken}, (err, access) => {
      if (err) {
        next(err);
      } else {
        if (!access) {
          options.properties.forEach(property => {
            delete ctx.req.body[property];
          });
        }
        next();
      }
    });
  });
};
