const { expect } = require('chai');
const CancelDelegationTokenCommand = require('../../../../dist/hive/Commands/CancelDelegationTokenCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    delegationToken: 'token'
};

const TCLIService_types = {
    TCancelDelegationTokenReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
};
const thriftClientMock = {
    CancelDelegationToken(request, callback) {
        return callback(null, responseMock);
    }
};

describe('CancelDelegationTokenCommand', () => {
    it('should return response', (cb) => {
        const command = new CancelDelegationTokenCommand(
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
