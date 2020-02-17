const fs = require('fs');
const config = require('./config');
const hive = require('../../');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;
const kerberos = require('kerberos');

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => config().then(({ hostname, ca, cert, key }) => client.connect({
    host: hostname,
    port: 10001,
    options: {
        path: '/hive',
        https: true,
        ca: fs.readFileSync(ca),
		cert: fs.readFileSync(cert),
		key: fs.readFileSync(key),
    }
}, new connections.HttpConnection(), new auth.KerberosHttpAuthentication({
    username: 'hive@KERBEROS.SERVER',
    password: 'hive'
}, new auth.helpers.MongoKerberosAuthProcess({
    fqdn: 'hive.driver',
    service: 'hive'
}, kerberos))));
