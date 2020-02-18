const fqdn = require('get-fqdn');
const path = require('path');

module.exports = () => {
    return Promise.resolve()
    .then(() => {
        if (process.env.HOSTNAME) {
            return process.env.HOSTNAME;
        } else {
            return fqdn();
        }
    })
    .then(hostname => {
        return ({
            hostname,
            ca: path.resolve(__dirname, '../../../../.docker/ssl/ca.pem'),
            cert: path.resolve(__dirname, '../../../../.docker/ssl/cert.pem'),
            key: path.resolve(__dirname, '../../../../.docker/ssl/key.key'),
        });
    });
};