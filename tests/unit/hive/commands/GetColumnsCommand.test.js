const { expect } = require('chai');
const GetColumnsCommand = require('../../../../dist/hive/Commands/GetColumnsCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
};

const TCLIService_types = {
    TGetColumnsReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_COLUMNS = 6;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_COLUMNS,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetColumns(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetColumnsCommand', () => {
    it('should return response', (cb) => {
        const command = new GetColumnsCommand(
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
