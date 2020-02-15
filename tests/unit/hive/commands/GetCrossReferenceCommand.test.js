const { expect } = require('chai');
const GetCrossReferenceCommand = require('../../../../dist/hive/Commands/GetCrossReferenceCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    parentCatalogName: 'parentCatalogName',
    parentSchemaName: 'parentSchemaName',
    parentTableName: 'parentTableName',
    foreignCatalogName: 'foreignCatalogName',
    foreignSchemaName: 'foreignSchemaName',
    foreignTableName: 'foreignTableName',
};

const TCLIService_types = {
    TGetCrossReferenceReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_CROSS_REFERENCE = 7;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_CROSS_REFERENCE,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetCrossReference(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetCrossReferenceCommand', () => {
    it('should return response', (cb) => {
        const command = new GetCrossReferenceCommand(
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
