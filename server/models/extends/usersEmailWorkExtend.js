/**
 * This code extend user model for work with emails and send system messages(confirm, reset...)
 */

const async = require('async');
const NOREPLY = 'noreply@oneplace.media';

module.exports = Model => {
  Model.prototype.sendEmailConfirmation = function(redirect, next) {
    if (Model.app.get('env') !== 'test') {
      const email = Model.app.models.email;
      const AccessToken = Model.app.models.AccessToken;

      async.waterfall([
        cbAsync => AccessToken.create({userId: this.id}, cbAsync),
        (token, cbAsync) => {
          const [protocol, empty, domain] = redirect ? decodeURIComponent(redirect).split('/') : [];
          redirect = [protocol, empty, domain, `auth/token`, token.id, token.userId].join('/');
          const confirmLink = `${Model.app.get('originApi')}${Model.app.get('restApiRoot')}/users/confirm?uid=${this.id}&token=${this.verificationToken}&redirect=${redirect}`;
          const options = {
            from: NOREPLY,
            to: this.email,
            subject: 'Подтверждение E-mail',
            html: email.getTemplate('emailConfirmation', Model.app).replace('%CONFIRM_LINK%', confirmLink)
          };
          email.send(options, err => {if (err) {console.log(err);} });
          cbAsync();
        }
      ], err => next(err));
    } else {
      next();
    }
  };



  Model.on('resetPasswordRequest', info => {
    if (Model.app.get('env') !== 'test') {
      const email = Model.app.models.email;
      let resetLink = Model.app.get('origin') + `/auth/reset/${info.accessToken.id}/${info.user.id}`;
      async.waterfall([
        cbAsync => Model.findById(info.user.id, cbAsync),
        (user, cbAsync) => {
          const options = {
            from: NOREPLY,
            to: info.email,
            subject: 'Восстановление доступа',
            html: email.getTemplate('resetPassword', Model.app).replace('%RESET_LINK%', resetLink)
          };
          email.send(options, cbAsync);
        }
      ], err => {
        if (err) {
          console.error(err);
        }
      });
    }
  });
};
