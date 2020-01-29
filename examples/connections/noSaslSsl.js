const fs = require('fs');
const config = require('./config');
const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const auth = require('../../index').auth;
const connections = require('../../index').connections;

const connection = new connections.TcpConnection();
const authProvider = new auth.NoSaslAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);
// !connect jdbc:hive2://volodymyr.local:10000/default;ssl=true;sslTrustStore=/opt/ssl/truststore.jks;trustStorePassword=1a2b3c;auth=noSasl hive hive
module.exports = () => config().then(({ hostname, ca, cert, key }) => {
    return client.connect({
        host: hostname,
        port: 10000,
        options: {
            ssl: true,
            username: 'hive',
            password: 'hive',
            ca: fs.readFileSync(ca),
            cert: fs.readFileSync(cert),
            key: fs.readFileSync(key),
        }
    }, connection, authProvider);
});