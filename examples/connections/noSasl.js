const hive = require('../../');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

const connection = new connections.TcpConnection();
const authProvider = new auth.NoSaslAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => client.connect({
    host: 'localhost',
    port: 10000,
}, connection, authProvider);