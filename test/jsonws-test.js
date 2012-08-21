var buster = require('buster'),
    http = require('http'),
    config =  require('./config'),
    createClient = require('../lib/jsonws').createClient;

/*global describe, before, after, it, expect */
buster.spec.expose();

describe('jsonws client', function () {
    var httpServer,
        responseData = {},
        lastRequest = {};

    var createHTTPServer = function (code, data) {
        return function () {
            httpServer = http.createServer(function (req, res) {
                lastRequest = {
                    url: require('url').parse(req.url, true),
                    headers: req.headers
                };

                res.writeHead(code, {'Content-Type': 'text/javascript'});
                res.end( JSON.stringify(responseData) );
            });
            httpServer.listen( config.port );

            this.jsonws = createClient( config );
            responseData = data;
        };
    };

    var tearDown = function () {
        httpServer.close();
        lastRequest = {};
    };

    describe('with server sending 200 response', function () {

        before( createHTTPServer(200, {paula: 'brillant'}) );
        after( tearDown );

        it('should call /api/secure/jsonws with signature', function (done) {
            this.jsonws('/paula/bean').on('data', function (data) {
                expect(lastRequest.url.pathname).toEqual('/api/secure/jsonws/paula/bean');
                done();
            });
        });

        it('should send authorization header', function (done) {
            this.jsonws('/paula/bean').on('data', function (data) {
                expect(lastRequest.headers['authorization']).toBeDefined();
                done();
            });
        });

        it('should call /api/secure/jsonws with parameters', function (done) {
            this.jsonws('/paula/bean', {brillant: 'ftw'}).on('data', function (data) {
                expect(lastRequest.url.query).toEqual({brillant: 'ftw'});
                done();
            });
        });

        it('should return JSON object', function (done) {
            this.jsonws('/paula/bean').on('data', function (data) {
                expect(data).toBeObject();
                expect(data['paula']).toEqual('brillant');
                done();
            });
        });

        it('should handle server side exceptions', function (done) {
            responseData = {exception: 'something went wrong'};
            this.jsonws('/paula/bean').on('error', function (data) {
                expect(data).toBeObject();
                expect(data['exception']).toEqual('something went wrong');
                done();
            });
        });

        it('should use callback', function (done) {
            this.jsonws('/paula/bean', {}, function (data) {
                expect(data).toBeObject();
                done();
            });
        });

    });

    describe('with server sending 401 response', function () {

        before( createHTTPServer(401) );
        after( tearDown );

        it('should invoke error handler', function (done) {
            this.jsonws('/paula/bean').on('error', function (data) {
                expect(data).toBeObject();
                done();
            });
        });
    });

});
