var buster = require('buster'),
    util = require('../lib/prop-util');

/*global describe, before, after, it, expect */
buster.spec.expose();

describe('toPropertyName', function () {
    var fixtures = [
        ['AnyString', 'anyString'],
        ['A', 'a'],
        ['a', 'a'],
        ['aBC', 'aBC'],
        ['any-string', 'anyString'],
        ['any_string', 'anyString'],
        ['a', 'a'],
        ['a-b-c', 'aBC'],
        ['', '']
    ];

    fixtures.forEach(function (fixture) {
        var input = fixture.shift(), expected = fixture.shift();
        var desc = ['converts', input, 'to', expected].join(' ');

        it(desc, function () {
            expect( util.toPropertyName(input) ).toEqual(expected);
        });
    });
});
