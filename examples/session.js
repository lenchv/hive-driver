const hive = require('../');
const { TCLIService_types } = hive.thrift;
const connection = require('./connections/kerberos');

const utils = new hive.HiveUtils(
    TCLIService_types
);

const kerberos = true;

connection().then(async client => {
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
    await createTables(session);
    const result = await Promise.all([
        session.getTypeInfo().then(handleOperation),
        session.getCatalogs().then(handleOperation),
        session.getSchemas({}).then(handleOperation),
        session.getTables({}).then(handleOperation),
        session.getTableTypes({}).then(handleOperation),
        session.getColumns({}).then(handleOperation),
        session.getFunctions({ functionName: 'create_union' }).then(handleOperation),
        session.getPrimaryKeys({ schemaName: 'default', tableName: 'table1' }).then(handleOperation),
        session.getCrossReference({
            parentCatalogName: '',
            parentSchemaName: 'default',
            parentTableName: 'table1',
            foreignCatalogName: '',
            foreignSchemaName: 'default',
            foreignTableName: 'table2'
        }).then(handleOperation),
    ]);

    if (kerberos) {
        const token = await session.getDelegationToken('hive', 'hive');
        const status = await session.cancelDelegationToken(token);

        result.push(token, status);
    }
    
    await session.close();

    return result;
}).then(([ typeInfo, catalogs, schemas, tables, tableTypes, columns, functions, primaryKeys, crossReference, token, canceledTokenStatus ]) => {
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

const createTables = async (session) => {
    await session.executeStatement('create table if not exists table1 ( id string, value integer, primary key(id) disable novalidate )').then(handleOperation);
    await session.executeStatement('create table if not exists table2 ( id string, table1_fk integer, primary key(id) disable novalidate, foreign key (table1_fk) references table1(id) disable novalidate)').then(handleOperation);
};
