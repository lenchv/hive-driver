const hive = require('../index');
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(client => {
    return client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
}).then(session => {
    return session.getInfo(
        TCLIService_types.TGetInfoType.CLI_DBMS_VER
    ).then(response => {
        if (!response.status.success()) {
            throw response.status.getError();
        }

        console.log(response.value.getValue());
    }).then(() => {
        return session.close();
    });
}).catch(error => {
    console.log(error);
});
