const { expect } = require('chai');
const HiveOperation = require('../../dist/HiveOperation').default;
const { TCLIService_types } = require('../../').thrift;

const getMock = (parent, prototype) => {
    const mock = function(...args) {
        parent.call(this, ...args);
    };
    mock.prototype = Object.create(parent.prototype);
    mock.prototype.constructor = mock;

    mock.prototype = Object.assign(mock.prototype, prototype);

    return mock;
};

const driverMock = {};
const operationHandle = {};

describe('HiveOperation.fetch', () => {
    it('should return success status if no results or it is not initialized', (cb) => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );

        operation.fetch().then((status) => {
            expect(status.success()).to.be.eq(true);
            cb();
        }).catch((error) => {
            cb(error);
        });
    });

    it('should return executing status if initialization still not finished', (cb) => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );
        operation.hasResultSet = true;

        operation.fetch().then((status) => {
            expect(status.executing()).to.be.eq(true);
            cb();
        }).catch((error) => {
            cb(error);
        });
    });

    it('should initilize schema and make first result request', (cb) => {
        const mockHiveOperation = getMock(HiveOperation, {
            initializeSchema() { return Promise.resolve('schema'); },

            firstFetch() { return Promise.resolve('data'); },

            processFetchResponse(data) { this.data.push(data); }
        });
        const operation = new mockHiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );
        operation.hasResultSet = true;
        operation.state = TCLIService_types.TOperationState.FINISHED_STATE;

        operation.fetch().then((status) => {
            expect(operation.schema).to.be.eq('schema');
            expect(operation.data).includes('data');
            cb();
        }).catch((error) => {
            cb(error);
        });
    });

    it('should make next result request if schema has been set', (cb) => {
        const mockHiveOperation = getMock(HiveOperation, {
            nextFetch() { return Promise.resolve('data'); },

            processFetchResponse(data) { this.data.push(data); }
        });
        const operation = new mockHiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );
        operation.schema = 'schema';
        operation.hasResultSet = true;
        operation.state = TCLIService_types.TOperationState.FINISHED_STATE;

        operation.fetch().then((status) => {
            expect(operation.data).includes('data');
            cb();
        }).catch((error) => {
            cb(error);
        });
    });
});

describe('HiveOperation.status', () => {
    it('should set operation state and hasResultSet', (cb) => {
        const operation = new HiveOperation(
            {
                getOperationStatus() {
                    return Promise.resolve({
                        status: {
                            statusCode: TCLIService_types.TStatusCode.SUCCESS_STATUS
                        },
                        operationState: 'state',
                        hasResultSet: true
                    });
                }
            },
            operationHandle,
            TCLIService_types
        );

        operation.status().then(() => {
            expect(operation.state).to.be.eq('state');
            expect(operation.hasResultSet).to.be.eq(true);
            cb();
        }).catch((error) => {
            cb(error);
        });
    });

    it('should throw error if status error', (cb) => {
        const operation = new HiveOperation(
            {
                getOperationStatus() {
                    return Promise.resolve({
                        status: {
                            statusCode: TCLIService_types.TStatusCode.ERROR_STATUS,
                            errorMessage: 'error'
                        },
                    });
                }
            },
            operationHandle,
            TCLIService_types
        );

        operation.status().then(() => {
            cb(new Error('must not be executed'));
        }).catch((error) => {
            expect(error.message).to.be.eq('error');
            cb();
        });
    });
});

describe('HiveOperation.cancel', () => {
    it('should run cancelOperation and return status', (cb) => {
        const operation = new HiveOperation(
            {
                cancelOperation() {
                    return Promise.resolve({
                        status: {
                            statusCode: TCLIService_types.TStatusCode.SUCCESS_STATUS
                        }
                    });
                }
            },
            operationHandle,
            TCLIService_types
        );

        operation.cancel().then((status) => {
            expect(status.success()).to.be.true;
            cb();
        }).catch((error) => {
            cb(error);
        });
    });
});

describe('HiveOperation.close', () => {
    it('should run closeOperation and return status', (cb) => {
        const operation = new HiveOperation(
            {
                closeOperation() {
                    return Promise.resolve({
                        status: {
                            statusCode: TCLIService_types.TStatusCode.SUCCESS_STATUS
                        }
                    });
                }
            },
            operationHandle,
            TCLIService_types
        );

        operation.close().then((status) => {
            expect(status.success()).to.be.true;
            cb();
        }).catch((error) => {
            cb(error);
        });
    });
});

describe('HiveOperation.getQueryId', () => {
    it('should return queryId', (cb) => {
        const operation = new HiveOperation(
            {
                getQueryId() {
                    return Promise.resolve({ queryId: 'id' });
                }
            },
            operationHandle,
            TCLIService_types
        );

        operation.getQueryId().then((queryId) => {
            expect(queryId).to.be.eq('id');
            cb();
        }).catch((error) => {
            cb(error);
        });
    });
});

describe('HiveOperation.checkIfOperationHasMoreRows', () => {
    it('should return true if response has hasMoreRows', () => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );

        const result = operation.checkIfOperationHasMoreRows({
            hasMoreRows: true
        });

        expect(result).to.be.true;
    });

    it('should return false if response does not have columns', () => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );

        const result = operation.checkIfOperationHasMoreRows({});

        expect(result).to.be.false;
    });

    it('should return true if at least one of the columns not empty', () => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );

        const result = (columnType) => operation.checkIfOperationHasMoreRows({
            results: { columns: [{ [columnType]: { values: ['a'] } }] }
        });

        expect(result('binaryVal')).to.be.true;
        expect(result('boolVal')).to.be.true;
        expect(result('byteVal')).to.be.true;
        expect(result('doubleVal')).to.be.true;
        expect(result('i16Val')).to.be.true;
        expect(result('i32Val')).to.be.true;
        expect(result('i64Val')).to.be.true;
        expect(result('stringVal')).to.be.true;
        expect(result('not_existed_type')).to.be.false;
    });

    it('should return false if all columns are empty', () => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );

        const result = operation.checkIfOperationHasMoreRows({
            results: { columns: [{ boolVal: { values: [] } }] }
        });

        expect(result).to.be.false;
    });
});

describe('HiveOperation.processFetchResponse', () => {
    it('should throw error if status an error', () => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );

        expect(() => operation.processFetchResponse({
            status: {
                statusCode: TCLIService_types.TStatusCode.ERROR_STATUS,
                errorMessage: 'error'
            },
        })).throws;
    });

    it('should set hasMoreRows and push data', () => {
        const mockHiveOperation = getMock(HiveOperation, {
            checkIfOperationHasMoreRows() {
                return true;
            }
        });
        const operation = new mockHiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );
        const result = operation.processFetchResponse({
            status: {
                statusCode: TCLIService_types.TStatusCode.SUCCESS_STATUS,
            },
            results: 'data'
        });

        expect(result.success()).to.be.true;
        expect(operation.hasMoreRows()).to.be.true;
        expect(operation.data).includes('data');
    });
});

describe('HiveOperation.flush', () => {
    it('should flush data', () => {
        const operation = new HiveOperation(
            driverMock,
            operationHandle,
            TCLIService_types
        );
        operation.data = [1, 2, 3];
        operation.flush();

        expect(operation.data).empty;
    });
});
