const moment = require('moment');

const CREATED  = 'created';
const UPDATED  = 'updated';
module.exports = Model => {
    Model.defineProperty(CREATED, {type: Number, description: 'Unix timestamp, from mixin'});
    Model.defineProperty(UPDATED, {type: Number, description: 'Unix timestamp, from mixin'});

    Model.observe('before save', (ctx, next) => {
        const now = moment().unix();
        if (ctx.isNewInstance) {
            ctx.instance.created = now;
        } else {
            if(ctx.data){
                delete ctx.data.created;
            }
        }
        if (ctx.instance) {
            ctx.instance.updated = now;
        } else {
            ctx.data.updated = now;
        }
        next();
    });
};
