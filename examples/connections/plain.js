const hive = require('../../');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

const connection = new connections.TcpConnection();
const authProvider = new auth.PlainTcpAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => client.connect({
    host: 'volodymyr.local',
    port: 10000,
    options: {}
}, connection, authProvider);