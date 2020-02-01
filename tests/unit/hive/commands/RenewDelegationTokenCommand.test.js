const { expect } = require('chai');
const RenewDelegationTokenCommand = require('../../../../dist/hive/Commands/RenewDelegationTokenCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    delegationToken: 'token'
};

const TCLIService_types = {
    TRenewDelegationTokenReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
};
const thriftClientMock = {
    RenewDelegationToken(request, callback) {
        return callback(null, responseMock);
    }
};

describe('RenewDelegationTokenCommand', () => {
    it('should return response', (cb) => {
        const command = new RenewDelegationTokenCommand(
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
