const hive = require('../../');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

// hdinsight credentials
const clustername = '';
const clusterUser = '';
const clusterPassword = '';

const connection = new connections.HttpConnection();
const authProvider = new auth.PlainHttpAuthentication({
    username: clusterUser,
    password: clusterPassword
});

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => client.connect({
    host: clustername + '.azurehdinsight.net',
    port: 443,
    options: {
        // /hive2 | /sparkhive2
        // depends on cluster type
        path: '/hive2',
        https: true
    }
}, connection, authProvider);
