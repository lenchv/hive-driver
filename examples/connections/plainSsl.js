const fs = require('fs');
const path = require('path');
const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const auth = require('../../index').auth;
const connections = require('../../index').connections;

const connection = new connections.TcpConnection();
const authProvider = new auth.PlainTcpAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => client.connect({
    host: 'volodymyr.local',
    port: 10000,
    options: {
        username: 'hive',
        password: 'hive',
        ssl: true,
        ca: fs.readFileSync(path.join(__dirname, '../../.docker/ssl/volodymyr.local_ca.pem')),
		cert: fs.readFileSync(path.join(__dirname, '../../.docker/ssl/volodymyr.local.pem')),
		key: fs.readFileSync(path.join(__dirname, '../../.docker/ssl/volodymyr.local.key')),
    }
}, connection, authProvider);