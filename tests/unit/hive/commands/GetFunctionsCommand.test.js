const { expect } = require('chai');
const GetFunctionsCommand = require('../../../../dist/hive/Commands/GetFunctionsCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
};

const TCLIService_types = {
    TGetFunctionsReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_FUNCTIONS = 7;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_FUNCTIONS,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetFunctions(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetFunctionsCommand', () => {
    it('should return response', (cb) => {
        const command = new GetFunctionsCommand(
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
