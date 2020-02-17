const config = require('./config');
const hive = require('../../');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

const kerberos = require('kerberos');

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => config().then(({ hostname }) => client.connect({
    host: hostname,
    port: 10001,
    options: {
        path: '/hive'
    }
}, new connections.HttpConnection(), new auth.KerberosHttpAuthentication({
    username: 'hive@KERBEROS.SERVER',
    password: 'hive'
}, new auth.helpers.MongoKerberosAuthProcess({
    fqdn: 'hive.driver',
    service: 'hive'
}, kerberos))));
