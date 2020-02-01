const { expect } = require('chai');
const GetInfoCommand = require('../../../../dist/hive/Commands/GetInfoCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    },
    infoType: 0
};

const TCLIService_types = {
    TGetInfoReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
    infoValue: {
        stringValue: '',
        smallIntValue: 0,
        integerBitmask: 1,
        integerFlag: 0,
        binaryValue: Buffer.from([]),
        lenValue: Buffer.from([])
    }
};
const thriftClientMock = {
    GetInfo(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetInfoCommand', () => {
    it('should return response', (cb) => {
        const command = new GetInfoCommand(
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
