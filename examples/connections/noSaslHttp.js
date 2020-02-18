const hive = require('../../');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

const connection = new connections.HttpConnection();
const authProvider = new auth.PlainHttpAuthentication({});

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => client.connect({
    host: 'volodymyr.local',
    port: 10001,
    options: {
        path: '/hive'
    }
}, connection, authProvider);