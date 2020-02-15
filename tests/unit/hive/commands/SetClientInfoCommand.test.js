const { expect } = require('chai');
const SetClientInfoCommand = require('../../../../dist/hive/Commands/SetClientInfoCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    configuration: {
        param: 'value'
    }
};

const TCLIService_types = {
    TSetClientInfoReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 }
};
const thriftClientMock = {
    SetClientInfo(request, callback) {
        return callback(null, responseMock);
    }
};

describe('SetClientInfoCommand', () => {
    it('should return response', (cb) => {
        const command = new SetClientInfoCommand(
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
