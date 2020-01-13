const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const mech = require('../../index').mechanisms;

const connection = new mech.NoSaslTcpConnection();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect({
    host: '192.168.99.100',
    port: 10000,
    options: {}
}, connection).then(client => {
    return client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
}).then((session) => {
    return session.close();
})
.then(status => {
    console.log('tcp no sasl: ', status.success());
})
.catch(console.error)