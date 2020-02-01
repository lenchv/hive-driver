const { expect } = require('chai');
const GetQueryIdCommand = require('../../../../dist/hive/Commands/GetQueryIdCommand').default;

const requestMock = {
    operationHandle: {
        sessionId: { guid: '', secret: '' }
    }
};

const TCLIService_types = {
    TGetQueryIdReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    queryId: 'id'
};
const thriftClientMock = {
    GetQueryId(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetQueryIdCommand', () => {
    it('should return response', (cb) => {
        const command = new GetQueryIdCommand(
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
