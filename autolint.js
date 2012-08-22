module.exports = {
    paths: [
        "./lib/*.js",
        "./test/*.js" 
    ],
    linter: "jshint",
    linterOptions: {
        node: true,
        onevar: false,
        strict: false,
        laxbreak: false,
        laxcomma: false,
        white: false,
        passfail: false,
        predef: []
    },
    excludes: []
};
