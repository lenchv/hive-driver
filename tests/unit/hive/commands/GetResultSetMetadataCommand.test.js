const { expect } = require('chai');
const GetResultSetMetadataCommand = require('../../../../dist/hive/Commands/GetResultSetMetadataCommand').default;

const requestMock = {
    operationHandle: {
        sessionId: { guid: '', secret: '' }
    }
};

const TCLIService_types = {
    TGetResultSetMetadataReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
    schema: {
        columns: [{
            columnName: 'column1',
            typeDesc: {
                types: [{
                    type: 0
                }]
            },
            position: 0,
            comment: ''
        }]
    }
};
const thriftClientMock = {
    GetResultSetMetadata(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetResultSetMetadataCommand', () => {
    it('should return response', (cb) => {
        const command = new GetResultSetMetadataCommand(
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
