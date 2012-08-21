var propUtil = require('./prop-util');

exports.jsonws = require('./jsonws');

exports.createServices = function (config) {
    var jsonws = this.jsonws.createClient(config);

    return require('./jsonws-api-spec').reduce(function (services, actionMapping) {
        var serviceName       = propUtil.toPropertyName( actionMapping.actionClassName );
        var serviceMethodName = propUtil.toPropertyName( actionMapping.path.split('/')[2] );

        if (!services[serviceName]) {
            services[serviceName] = {};
        }

        services[serviceName][serviceMethodName] = (function (path) {
            return function (param, callback) {
                return jsonws(path, param, callback);
            }
        }( actionMapping.path ));

        return services;
    }, {});
};
