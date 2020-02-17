const hive = require('../');
const { TCLIService, TCLIService_types } = hive.thrift;
const HiveDriver = hive.HiveDriver;
const thrift = require('thrift');

let driver = null;

const authProvider = new hive.auth.NoSaslAuthentication();
const connectionProvider = new hive.connections.TcpConnection();

connectionProvider.connect({
    host: 'localhost',
    port: 10000
}, authProvider).then((connection) => {
    driver = new HiveDriver(
        TCLIService_types,
        thrift.createClient(TCLIService, connection.getConnection())
    );

    return driver.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
})
.then((sessionResponse) => {
    if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== sessionResponse.status.statusCode) {
        return Promise.reject(new Error(sessionResponse.status.errorMessage));
    }

    return Promise.all([
        getInfo(driver, sessionResponse, TCLIService_types.TGetInfoType.CLI_DBMS_VER),
        executeStatement(driver, sessionResponse, 'create table table1 ( id string, value integer, primary key(id) disable novalidate )'),
        executeStatement(driver, sessionResponse, 'create table table2 ( id string, table1_fk integer, primary key(id) disable novalidate, foreign key (table1_fk) references table1(id) disable novalidate)'),
        executeStatement(driver, sessionResponse, 'show tables'),
        getTypeInfo(driver, sessionResponse),
        getCatalogs(driver, sessionResponse),
        getSchemas(driver, sessionResponse),
        getTables(driver, sessionResponse),
        getTableTypes(driver, sessionResponse),
        getColumns(driver, sessionResponse),
        getFunctions(driver, sessionResponse, 'SUM'),
        getPrimaryKeys(driver, sessionResponse, 'default', 'table1'),
        getCrossReference(driver, sessionResponse),
        _executeStatement(driver, sessionResponse, 'select * from table1').then(cancelOperation.bind(null, driver)),
        executeStatement(driver, sessionResponse, 'drop table table1'),
        executeStatement(driver, sessionResponse, 'drop table table2'),
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

function _executeStatement(driver, sessionResponse, statement) {
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

        return response;
    });
}

function executeStatement(driver, sessionResponse, statement) {
    return _executeStatement(driver, sessionResponse, statement)
        .then((response) => {
            return getOperationHandle(driver, response);
        });
}

function getOperationHandle(driver, response) {
    if (!response.operationHandle.hasResultSet) {
        return Promise.resolve({});
    }

    return getOperationStatus(driver, response, true)
    .then(() => {
        return Promise.all([
            driver.getResultSetMetadata({ operationHandle: response.operationHandle }),
            driver.fetchResults({
                operationHandle: response.operationHandle,
                orientation: TCLIService_types.TFetchOrientation.FETCH_FIRST,
                maxRows: 1000,
            })
        ]);
    })
    .then(([ resulSetMetaDataResponse, resultResponse ]) => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== resulSetMetaDataResponse.status.statusCode) {
            return Promise.reject(new Error(resulSetMetaDataResponse.status.errorMessage));
        }

        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== resultResponse.status.statusCode) {
            return Promise.reject(new Error(resultResponse.status.errorMessage));
        }

        return closeOperation(driver, response).then(() => {
            return {
                result: resultResponse,
                metadata: resulSetMetaDataResponse
            };
        });
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

function getCrossReference(driver, sessionResponse) {
    return driver.getCrossReference({
        sessionHandle: sessionResponse.sessionHandle,
        parentCatalogName: '',
        parentSchemaName: 'default',
        parentTableName: 'table1',
        foreignCatalogName: '',
        foreignSchemaName: 'default',
        foreignTableName: 'table2'
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        if (response.operationHandle.operationType !== TCLIService_types.TOperationType.GET_FUNCTIONS) {
            return Promise.reject(new Error('Get cross reference: operation type is different'));
        }

        return getOperationHandle(driver, response);
    })
    .then(result => {
        return result;
    });
}

function getOperationStatus(driver, operationResponse, progress) {
    return driver.getOperationStatus({
        operationHandle: operationResponse.operationHandle,
        getProgressUpdate: progress
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function cancelOperation(driver, operationResponse) {
    return driver.cancelOperation({
        operationHandle: operationResponse.operationHandle,
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function closeOperation(driver, operationResponse) {
    return driver.closeOperation({
        operationHandle: operationResponse.operationHandle,
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function getDelegationToken(driver, sessionResponse, owner, renewer) {
    return driver.getDelegationToken({
        sessionHandle: sessionResponse.sessionHandle,
        owner,
        renewer,
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function cancelDelegationToken(driver, sessionResponse, delegationToken) {
    return driver.cancelDelegationToken({
        sessionHandle: sessionResponse.sessionHandle,
        delegationToken
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function renewDelegationToken(driver, sessionResponse, delegationToken) {
    return driver.renewDelegationToken({
        sessionHandle: sessionResponse.sessionHandle,
        delegationToken
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function getQueryId(driver, operationResponse) {
    return driver.getQueryId({
        operationHandle: operationResponse.operationHandle,
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

function setClientInfo(driver, sessionResponse, configuration) {
    return driver.setClientInfo({
        sessionHandle: sessionResponse.sessionHandle,
        configuration
    }).then(response => {
        if (TCLIService_types.TStatusCode.SUCCESS_STATUS !== response.status.statusCode) {
            return Promise.reject(new Error(response.status.errorMessage));
        }

        return response;
    });
}

