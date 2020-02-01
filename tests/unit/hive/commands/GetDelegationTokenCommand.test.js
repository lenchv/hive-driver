const { expect } = require('chai');
const GetDelegationTokenCommand = require('../../../../dist/hive/Commands/GetDelegationTokenCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    owner: 'user1',
    renewer: 'user2'
};

const TCLIService_types = {
    TGetDelegationTokenReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
    delegationToken: 'token'
};
const thriftClientMock = {
    GetDelegationToken(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetDelegationTokenCommand', () => {
    it('should return response', (cb) => {
        const command = new GetDelegationTokenCommand(
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
