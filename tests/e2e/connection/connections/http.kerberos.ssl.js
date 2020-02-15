const config = require('./config');
const fs = require('fs');
const kerberos = require('kerberos');

module.exports = (client, connections, auth) => config().then(({ hostname, ca, cert, key }) => {
    return client.connect({
        host: hostname,
        port: 10001,
        options: {
            path: '/hive',
            https: true,
            ca: fs.readFileSync(ca),
            cert: fs.readFileSync(cert),
            key: fs.readFileSync(key)
        }
    }, new connections.HttpConnection(), new auth.KerberosHttpAuthentication({
        username: 'hive@KERBEROS.SERVER',
        password: 'hive'
    }, new auth.helpers.MongoKerberosAuthProcess({
        fqdn: 'hive.driver',
        service: 'hive'
    }, kerberos)));
});