const config = require('./config');
const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const auth = require('../../index').auth;
const connections = require('../../index').connections;

const connection = new connections.HttpConnection();
const authProvider = new auth.PlainHttpAuthentication({
    username: 'admin',
    password: '123456'
});

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => config().then(({ hostname }) => client.connect({
    host: hostname,
    port: 10001,
    options: {
        path: '/hive'
    }
}, connection, authProvider));