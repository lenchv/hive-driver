const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../index').HiveClient;
const mech = require('../index').mechanisms;
const ResponseCombiner = require('../index').ResponseCombiner;

const client = new HiveClient({
    connectionOptions: {
        host: '192.168.99.100',
        port: 10000
    },
    protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V9,
    TCLIService,
    TCLIService_types,
});

const exec = (client, statement) => {
    return client.execute(statement).then(response => {
        const result = new ResponseCombiner(TCLIService_types);
        console.log(result.combine(response));
    });
};

client.connect(new mech.NoSaslTcpConnection())
    .then(thriftClient => {
        return client.openSession();
    })
    .then(session => {
        return exec(client, 'CREATE TABLE pokes (foo INT, bar STRING)');
    })
    .then(() => {
        return exec(client, 'LOAD DATA LOCAL INPATH \'/opt/hive/examples/files/kv1.txt\' OVERWRITE INTO TABLE pokes');
    })
    .then(() => {
        return Promise.all([
            exec(client, 'show tables'),
            exec(client, 'describe pokes'),
            exec(client, 'select * from pokes limit 10'),
        ]);
    })
    .then(() => {
        return exec(client, 'drop table pokes');
    });
