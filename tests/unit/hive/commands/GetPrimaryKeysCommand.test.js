const { expect } = require('chai');
const GetPrimaryKeysCommand = require('../../../../dist/hive/Commands/GetPrimaryKeysCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
};

const TCLIService_types = {
    TGetPrimaryKeysReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_PRIMARY_KEYS = 7;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_PRIMARY_KEYS,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetPrimaryKeys(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetPrimaryKeysCommand', () => {
    it('should return response', (cb) => {
        const command = new GetPrimaryKeysCommand(
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
