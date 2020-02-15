const { expect } = require('chai');
const GetSchemasCommand = require('../../../../dist/hive/Commands/GetSchemasCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    catalogName: 'catalog',
    schemaName: 'schema'
};

const TCLIService_types = {
    TGetSchemasReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_SCHEMAS = 3;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_SCHEMAS,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetSchemas(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetSchemasCommand', () => {
    it('should return response', (cb) => {
        const command = new GetSchemasCommand(
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
