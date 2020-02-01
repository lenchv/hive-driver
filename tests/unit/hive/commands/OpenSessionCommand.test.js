const { expect } = require('chai');
const OpenSessionCommand = require('../../../../dist/hive/Commands/OpenSessionCommand').default;

const CLIENT_PROTOCOL = 8;

const TCLIService_types = {
    TOpenSessionReq: function (options) {
        this.options = options;

        expect(options.client_protocol).to.be.eq(CLIENT_PROTOCOL);
    }
};
const responseMock = {
    status: { statusCode: 0 },
    serverProtocolVersion: CLIENT_PROTOCOL,
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    configuration: {}
};
const thriftClientMock = {
    OpenSession(request, callback) {
        return callback(null, responseMock);
    }
};

describe('OpenSessionCommand', () => {
    it('should return response', (cb) => {
        const command = new OpenSessionCommand(
            thriftClientMock,
            TCLIService_types
        );

        command.execute({
            client_protocol: CLIENT_PROTOCOL 
        }).then(response => {
            expect(response).to.be.deep.eq(responseMock);
            cb();
        }).catch(error => {
            cb(error);
        });
    });
});
