module.exports = Model => {
    Model.definition.rawProperties.id.default = Model.definition.properties.id.default = require('uuid/v1');
};
