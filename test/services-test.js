var buster = require('buster'),
    http = require('http'),
    EventEmitter = require('events').EventEmitter,
    config =  require('./config'),
    lportal = require('../lib/lportal');

/*global describe, before, after, it, expect */
buster.spec.expose();

describe('createServices', function () {
    before(function () {
        var jsonwsStub = this.jsonwsStub = this.stub();
        this.emitter = new EventEmitter();
        jsonwsStub.returns( this.emitter );

        this.stub( lportal.jsonws, 'createClient', function () {
            return jsonwsStub;
        });

        this.services = lportal.createServices(config);
    });

    it('should create jsonws client', function () {
        expect( lportal.jsonws.createClient ).toHaveBeenCalled();
    });

    it('should have services for blog entries', function () {
        expect( this.services.blogsEntry ).toBeObject();
        expect( this.services.blogsEntry.getEntry ).toBeFunction();
        expect( this.services.blogsEntry.subscribe ).toBeFunction();
    });

    it('should have services for address', function () {
        expect( this.services.address ).toBeObject();
        expect( this.services.address.getAddress ).toBeFunction();
        expect( this.services.address.updateAddress ).toBeFunction();
    });


    it('blogEntry#getEntry should use jsonws client', function () {
        var emitter = this.services.blogsEntry.getEntry({entryId: 123});
        expect( this.jsonwsStub ).toHaveBeenCalledWith('/blogsentry/get-entry', {entryId: 123});
        expect( emitter ).toBe( this.emitter );
    });

    it('blogEntry#subscribe should use jsonws client', function () {
        var callback = function () {};
        var emitter = this.services.blogsEntry.subscribe({groupId: 42}, callback);
        expect( this.jsonwsStub ).toHaveBeenCalledWith(
            '/blogsentry/subscribe',
            {groupId: 42},
            callback
        );
        expect( emitter ).toBe( this.emitter );
    });

    it('address#getAddress should use jsonws client', function () {
        var callback = function () {};
        var emitter = this.services.address.getAddress({addressId: 123}, callback);
        expect( this.jsonwsStub ).toHaveBeenCalledWith(
            '/address/get-address',
            {addressId: 123},
            callback
        );
        expect( emitter ).toBe( this.emitter );
    });
});
