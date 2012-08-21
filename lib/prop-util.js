
exports.toPropertyName = function (str) {
    var parts = str.split(/_|-/);
    var firstPart = parts.shift();

    return parts.reduce(function(prev, curr) {
        return [prev, curr.slice(0, 1).toUpperCase(), curr.slice(1)].join('');
    }, [ firstPart.slice(0, 1).toLowerCase(), firstPart.slice(1) ].join('') );
};
