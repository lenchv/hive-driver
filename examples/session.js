const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../index').HiveClient;
const HiveUtils = require('../index').HiveUtils;
const mech = require('../index').mechanisms;

const connection = new mech.NoSaslTcpConnection();

const utils = new HiveUtils(
    TCLIService_types
);

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect({
    host: '192.168.99.100',
    port: 10000,
    options: {
    }
}, connection).then(client => {
    return client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V9
    });
}).then((session) => {
    return Promise.all([
        session.getTypeInfo().then(handleOperation),
        session.getCatalogs().then(handleOperation),
        session.getSchemas().then(handleOperation),
        session.getTables().then(handleOperation),
        session.getTableTypes().then(handleOperation),
        session.getColumns().then(handleOperation),
        session.getFunctions('create_union').then(handleOperation),
        session.getPrimaryKeys('default', 't1').then(handleOperation),
    ]).then(result => {
        return session.close().then(() => result);
    });
}).then(([ typeInfo, catalogs, schemas, tables, tableTypes, columns, functions, primaryKeys ]) => {
    console.log('done');
}).catch(error => {
    console.log(error);
});

const handleOperation = (operation) => {
    return utils.waitUntilReady(operation, true, (stateResponse) => {
        console.log(stateResponse.taskStatus);
    })
    .then((operation) => {
        return utils.fetchAll(operation);
    })
    .then(operation => {
        return operation.close();
    })
    .then(() => {
        return utils.getResult(operation).getValue();
    })
};
