const { expect } = require('chai');
const GetTypeInfoCommand = require('../../../../dist/hive/Commands/GetTypeInfoCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    }
};

const TCLIService_types = {
    TGetTypeInfoReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_TYPE_INFO = 1;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_TYPE_INFO,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetTypeInfo(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetTypeInfoCommand', () => {
    it('should return response', (cb) => {
        const command = new GetTypeInfoCommand(
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
