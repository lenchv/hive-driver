const { expect } = require('chai');
const CloseSessionCommand = require('../../../../dist/hive/Commands/CloseSessionCommand').default;

const TCLIService_types = {
    TCloseSessionReq: function (options) {
        this.options = options;

        expect(options).has.property('sessionHandle');
    }
};
const responseMock = {
    status: { statusCode: 0 }
};
const thriftClientMock = {
    CloseSession(request, callback) {
        return callback(null, responseMock);
    }
};

describe('CloseSessionCommand', () => {
    it('should return response', (cb) => {
        const command = new CloseSessionCommand(
            thriftClientMock,
            TCLIService_types
        );

        command.execute({
            sessionHandle: {
                sessionId: { guid: '', secret: '' }
            } 
        }).then(response => {
            expect(response).to.be.deep.eq(responseMock);
            cb();
        }).catch(error => {
            cb(error);
        });
    });
});
