var http = require('http'),
    qs = require('querystring'),
    EventEmitter = require('events').EventEmitter;

exports.createClient = function (config) {
    return function jsonwsClient(signature, param, callback) {

        var pathname = '/api/secure/jsonws'.concat( signature );

        if (param) {
            pathname += '?'.concat( qs.stringify(param) );
        }

        var options = {
            hostname: config.hostname,
            port: config.port,
            auth: config.auth,
            path: pathname
        };

        var emitter = new EventEmitter();

        if (callback) {
            emitter.on('data', callback);
        }

        http.get(options, function (res) {
            res.setEncoding('utf8');

            if (res.statusCode !== 200) {
                emitter.emit('error', {
                    exception: 'Got response code ' + res.statusCode
                });
                return;
            }

            var data = '';
            res.on('data', function onData(chunk) {
                data += chunk;
            });

            res.on('end', function onEnd() {
                var obj = JSON.parse(data);
                if (obj.exception) {
                    emitter.emit('error', obj);
                } else {
                    emitter.emit('data', obj);
                }
            });
        });

        return emitter;
    };
};
