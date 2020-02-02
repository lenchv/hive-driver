// !connect jdbc:hive2://localhost:10000/;principal=hive/hive.driver@KERBEROS.SERVER

const config = require('./config');
const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const auth = require('../../index').auth;
const connections = require('../../index').connections;
const kerberos = require('kerberos');

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => config().then(({ hostname }) => client.connect({
    host: hostname,
    port: 10000,
    options: {}
}, new connections.TcpConnection(), new auth.KerberosTcpAuthentication({
    username: 'hive@KERBEROS.SERVER',
    password: 'hive'
}, new kerberos.processes.MongoAuthProcess(
    'hive.driver',
    '',
    'hive'
))));
