const hive = require('../../');
const config = require('./config');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

const connection = new connections.TcpConnection();
const authProvider = new auth.PlainTcpAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => config().then(({hostname}) => client.connect({
    host: hostname,
    port: 10000,
    options: {}
}, connection, authProvider));