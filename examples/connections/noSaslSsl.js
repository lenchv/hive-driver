const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const mech = require('../../index').mechanisms;
const fs = require('fs');

const connection = new mech.NoSaslTcpConnection();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect({
    host: 'volodymyr.local',
    port: 10000,
    options: {
        ssl: true,
        ca: fs.readFileSync('C:\\Users\\lench\\docker_projects\\docker-hive\\ssl\\volodymyr.local_ca.pem'),
		cert: fs.readFileSync('C:\\Users\\lench\\docker_projects\\docker-hive\\ssl\\volodymyr.local.pem'),
		key: fs.readFileSync('C:\\Users\\lench\\docker_projects\\docker-hive\\ssl\\volodymyr.local.key'),
    }
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