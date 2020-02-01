const { expect } = require('chai');
const GetTableTypesCommand = require('../../../../dist/hive/Commands/GetTableTypesCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
};

const TCLIService_types = {
    TGetTableTypesReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_TABLE_TYPES = 5;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_TABLE_TYPES,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetTableTypes(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetTableTypesCommand', () => {
    it('should return response', (cb) => {
        const command = new GetTableTypesCommand(
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
