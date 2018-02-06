const fs    = require('fs');

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
};
