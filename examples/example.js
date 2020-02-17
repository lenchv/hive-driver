const hive = require('../');
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);
const utils = new hive.HiveUtils(
    TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(async client => {
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
    
    const createTableOperation = await session.executeStatement(
        'CREATE TABLE IF NOT EXISTS pokes (foo INT, bar STRING)'
    );
    await utils.waitUntilReady(createTableOperation, false, () => {});
    await createTableOperation.close();
    
    const loadDataOperation = await session.executeStatement(
        'LOAD DATA LOCAL INPATH \'/opt/apache-hive-2.3.6-bin/examples/files/kv1.txt\' OVERWRITE INTO TABLE pokes'
    );
    await utils.waitUntilReady(loadDataOperation, false, () => {});
    await loadDataOperation.close();
    
    const selectDataOperation = await session.executeStatement(
        'select * from pokes', { runAsync: true }
    );
    await utils.waitUntilReady(selectDataOperation, false, () => {});
    await utils.fetchAll(selectDataOperation);
    await selectDataOperation.close();
    
    const result = utils.getResult(selectDataOperation).getValue();
    
    console.log(JSON.stringify(result, null, '\t'));
    
    await session.close();
    await client.close();
})
.catch(error => {
    console.error(error);
});
