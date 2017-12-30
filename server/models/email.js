const fs    = require('fs');

// const emailLib = require('../../server/libs/mail');
module.exports = Email => {
    let templates = {
        emailConfirmation_ru : fs.readFileSync(`${__dirname}/../emails/emailConfirmation_ru.html`).toString(),
        emailConfirmation_en : fs.readFileSync(`${__dirname}/../emails/emailConfirmation_en.html`).toString(),
        resetPassword_ru      : fs.readFileSync(`${__dirname}/../emails/resetPassword_ru.html`).toString(),
        resetPassword_en      : fs.readFileSync(`${__dirname}/../emails/resetPassword_en.html`).toString()
    };

    Email.getTemplate = function (template, app) {
        return templates[template].replace(/{imagePath}/g, `${app.get('baseUrl')}/static/img`);
    };

    // Email.smartSend = function (options, cb) {
    //     Email.app.models.User.findOne({where: {email: options.to}}, (err, user) => {
    //         if (err) {
    //             cb(err);
    //         } else {
    //             if (user && user.resellerId) {
    //                 Email.app.models.User.findOne({where: {id: user.resellerId}}, (err, reseller) => {
    //                     if (err) {
    //                         cb(err);
    //                     } else {
    //                         options.from     = `"${reseller.resellerSetting.name}" <${reseller.resellerSetting.mailUser}>`;
    //                         options.authUser = reseller.resellerSetting.mailUser;
    //                         options.authPass = reseller.resellerSetting.mailPassword;
    //                         options.html     = options.html
    //                             .replace(/viapush\.com/g, reseller.resellerSetting.domain)
    //                             .replace(/ViaPush/g, reseller.resellerSetting.name);

    //                         emailLib.send(options, cb);
    //                     }
    //                 });
    //             } else {
    //                 options.from = '"ViaPush" <noreply@viapush.com>';
    //                 this.send(options, cb);
    //             }
    //         }
    //     });
    // };

};
