const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../index').HiveClient;
const mech = require('../index').mechanisms;
const ResponseCombiner = require('../index').ResponseCombiner;

const client = new HiveClient({
    connectionOptions: {
        host: 'localhost',
        port: 20001
    },
    protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V9,
    TCLIService,
    TCLIService_types,
});

client.connect(new mech.NoSaslTcpConnection())
    .then(thriftClient => {
        return client.openSession();
    })
    .then(session => {
        return client.execute('show databases');
    })
    .then(response => {
        const result = new ResponseCombiner(TCLIService_types);
        console.log(result.combine(response));
    });
