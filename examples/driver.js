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

    return Promise.all([
        executeStatement(driver, sessionResponse, 'show tables'),
        getInfo(driver, sessionResponse, TCLIService_types.TGetInfoType.CLI_DBMS_NAME),
        getTypeInfo(driver, sessionResponse),
        getCatalogs(driver, sessionResponse),
        getSchemas(driver, sessionResponse),
        getTables(driver, sessionResponse),
        getTableTypes(driver, sessionResponse),
        getColumns(driver, sessionResponse),
        getFunctions(driver, sessionResponse, 'SUM'),
        getPrimaryKeys(driver, sessionResponse, 'default', 'pokes'),
    ]).then(() => {
        return sessionResponse;
    });
}).then(response => {
    return driver.closeSession(response);
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

function executeStatement(driver, sessionResponse, statement) {
    return driver.executeStatement({
        sessionHandle: sessionResponse.sessionHandle,
        statement: statement,
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
        return getOperationHandle(driver, response);
    });
}

function getOperationHandle(driver, response) {
    return Promise.all([
        driver.getResultSetMetadata({ operationHandle: response.operationHandle }),
        driver.fetchResults({
            operationHandle: response.operationHandle,
            orientation: TCLIService_types.TFetchOrientation.FETCH_FIRST,
            maxRows: 1000,
        })
    ]).then(([ resulSetMetaDataResponse, resultResponse ]) => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== resulSetMetaDataResponse.status.statusCode) {
            return Promise.reject(new Error(resulSetMetaDataResponse.status.errorMessage));
        }

        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== resultResponse.status.statusCode) {
            return Promise.reject(new Error(resultResponse.status.errorMessage));
        }

        return {
            result: resultResponse,
            metadata: resulSetMetaDataResponse
        };
    });
}

function getInfo(driver, sessionResponse, infoType) {
    return driver.getInfo({
        sessionHandle: sessionResponse.sessionHandle,
        infoType
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function getTypeInfo(driver, sessionResponse) {
    return driver.getTypeInfo({
        sessionHandle: sessionResponse.sessionHandle
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_TYPE_INFO) {
            return Promise.reject(new Error('Get tables: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getCatalogs(driver, sessionResponse) {
    return driver.getCatalogs({
        sessionHandle: sessionResponse.sessionHandle
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }
        
        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_CATALOGS) {
            return Promise.reject(new Error('Get catalogs: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getSchemas(driver, sessionResponse) {
    return driver.getSchemas({
        sessionHandle: sessionResponse.sessionHandle
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_SCHEMAS) {
            return Promise.reject(new Error('Get schemas: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getTables(driver, sessionResponse) {
    return driver.getTables({
        sessionHandle: sessionResponse.sessionHandle
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_TABLES) {
            return Promise.reject(new Error('Get table types: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getTableTypes(driver, sessionResponse) {
    return driver.getTableTypes({
        sessionHandle: sessionResponse.sessionHandle
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_TABLE_TYPES) {
            return Promise.reject(new Error('Get table types: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getColumns(driver, sessionResponse) {
    return driver.getColumns({
        sessionHandle: sessionResponse.sessionHandle
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_COLUMNS) {
            return Promise.reject(new Error('Get columns: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getFunctions(driver, sessionResponse, functionName) {
    return driver.getFunctions({
        sessionHandle: sessionResponse.sessionHandle,
        functionName
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_FUNCTIONS) {
            return Promise.reject(new Error('Get functions: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getPrimaryKeys(driver, sessionResponse, schemaName, tableName) {
    return driver.getPrimaryKeys({
        sessionHandle: sessionResponse.sessionHandle,
        schemaName,
        tableName,
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_FUNCTIONS) {
            return Promise.reject(new Error('Get primary keys: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}
