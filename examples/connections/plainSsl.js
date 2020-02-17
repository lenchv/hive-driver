const fs = require('fs');
const config = require('./config');
const hive = require('../../');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

const connection = new connections.TcpConnection();
const authProvider = new auth.PlainTcpAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => config().then(({ hostname, ca, cert, key }) => client.connect({
    host: hostname,
    port: 10000,
    options: {
        username: 'hive',
        password: 'hive',
        ssl: true,
        ca: fs.readFileSync(ca),
		cert: fs.readFileSync(cert),
		key: fs.readFileSync(key),
    }
}, connection, authProvider));