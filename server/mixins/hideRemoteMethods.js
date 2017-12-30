const RELATION_METHODS = ['get','count','create','delete','destroyById','findById','updateById','link','unlink','exists','update','destroy'];

function setMethodsVisibility(Model,methods) {
    methods = methods || [];
    Model.sharedClass.methods().forEach(method => {
        method.shared = ~methods.indexOf(method.name);
        if(method.name === 'updateAttributes' && method.shared){
            method.isStatic = false;
        }
    });
}

module.exports = (Model, options) => {
    if(options.methodsVisibility){
        setMethodsVisibility(Model,options.methodsVisibility);
    }

    if(options.hiddenRelationsRemoteMethods){
        options.hiddenRelationsRemoteMethods.forEach(option=>{
            let relation = typeof option === "string" ? option : option.relation;
            let methods  = typeof option === "string" ? RELATION_METHODS : option.methods;
            methods.forEach(action=>{
                Model.disableRemoteMethodByName(`prototype.__${action}__${relation}`);
            });
        });
    }
};