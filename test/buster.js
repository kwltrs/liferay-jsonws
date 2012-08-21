var config = module.exports;

config['Lportal Tests'] = {
    rootPath: "../",
    environment: "node",
    sources: [
        "lib/lportal.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};
