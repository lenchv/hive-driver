const { expect } = require('chai');
const GetTablesCommand = require('../../../../dist/hive/Commands/GetTablesCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    catalogName: 'catalog',
    schemaName: 'schema',
    tableName: 'table',
    tableTypes: ['TABLE', 'VIEW', 'SYSTEM TABLE', 'GLOBAL TEMPORARY', 'LOCAL TEMPORARY', 'ALIAS', 'SYNONYM']
};

const TCLIService_types = {
    TGetTablesReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_TABLES = 4;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_TABLES,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetTables(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetTablesCommand', () => {
    it('should return response', (cb) => {
        const command = new GetTablesCommand(
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
