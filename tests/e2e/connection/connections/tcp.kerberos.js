const config = require('./config');
const kerberos = require('kerberos');

module.exports = (client, connections, auth) => config().then(({ hostname }) => {
    return client.connect({
        host: hostname,
        port: 10000,
        options: {}
    }, new connections.TcpConnection(), new auth.KerberosTcpAuthentication({
        username: 'hive@KERBEROS.SERVER',
        password: 'hive'
    }, new auth.helpers.MongoKerberosAuthProcess({
        fqdn: 'hive.driver',
        service: 'hive'
    }, kerberos)));
});