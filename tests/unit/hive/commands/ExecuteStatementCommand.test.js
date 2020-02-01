const { expect } = require('chai');
const ExecuteStatementCommand = require('../../../../dist/hive/Commands/ExecuteStatementCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    statement: 'show tables',
    confOverlay: {},
    runAsync: false,
    queryTimeout: 0
};

const TCLIService_types = {
    TExecuteStatementReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const EXECUTE_STATEMENT = 0;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: EXECUTE_STATEMENT,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    ExecuteStatement(request, callback) {
        return callback(null, responseMock);
    }
};

describe('ExecuteStatementCommand', () => {
    it('should return response', (cb) => {
        const command = new ExecuteStatementCommand(
            thriftClientMock,
            TCLIService_types
        );

        command.execute(requestMock)
        .then(response => {
            expect(response).to.be.deep.eq(responseMock);
            cb();
        }).catch(error => {
            cb(error);
        });
    });
});
