const fqdn = require('get-fqdn');
const path = require('path');

module.exports = () => fqdn().then(hostname => ({
    hostname,
    ca: path.resolve(__dirname, '../../.docker/ssl/ca.pem'),
    cert: path.resolve(__dirname, '../../.docker/ssl/cert.pem'),
    key: path.resolve(__dirname, '../../.docker/ssl/key.key'),
}));