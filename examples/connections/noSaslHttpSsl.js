const fs = require('fs');
const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const auth = require('../../index').auth;
const connections = require('../../index').connections;

const connection = new connections.HttpConnection();
const authProvider = new auth.NoSaslAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => client.connect({
    host: 'volodymyr.local',
    port: 10001,
    options: {
        path: '/hive',
        https: true,
        ca: fs.readFileSync('C:\\Users\\lench\\docker_projects\\docker-hive\\ssl\\volodymyr.local_ca.pem'),
		cert: fs.readFileSync('C:\\Users\\lench\\docker_projects\\docker-hive\\ssl\\volodymyr.local.pem'),
		key: fs.readFileSync('C:\\Users\\lench\\docker_projects\\docker-hive\\ssl\\volodymyr.local.key'),
    }
}, connection, authProvider);