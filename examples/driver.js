const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
const HiveDriver = require('../index').HiveDriver;
const mech = require('../index').mechanisms;

const driver = new HiveDriver(
    TCLIService,
    TCLIService_types
);

const connectionProvider = new mech.NoSaslTcpConnection();

connectionProvider.connect({
    host: '192.168.99.100',
    port: 10000
}).then((connection) => {
    driver.createClient(connection);

    return driver.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V9
    });
})
.then((sessionResponse) => {
    if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== sessionResponse.status.statusCode) {
        return Promise.reject(new Error(sessionResponse.status.errorMessage));
    }

    return driver.executeStatement({
        sessionHandle: sessionResponse.sessionHandle,
        statement: 'show tables',
        confOverlay: {},
        runAsync: false,
        queryTimeout: 2000
    })
    .then((response) => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.EXECUTE_STATEMENT) {
            return Promise.reject(new Error('Execute statment: operation type is different'));
        }

        if (!response.operationHandle.hasResultSet) {
            return Promise.reject(new Error('Execute statment: no result returned'));
        }

        return response;
    }).then((response) => {
        
    }).then(() => {
        return sessionResponse;
    });
}).then(response => {
    if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
        return Promise.reject(new Error(response.status.errorMessage));
    }
}).then(() => {
    console.log('ok');
}).catch(error => {
    console.error(error);
    console.log('failed');
});
