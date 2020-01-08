const request = require('request');
const rp = require('request-promise');

exports.callAsync = (endpoint) => {
    return rp(endpoint)
        .then(result => {
            return JSON.parse(result);
        });
};