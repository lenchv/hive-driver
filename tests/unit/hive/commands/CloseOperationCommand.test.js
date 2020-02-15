const { expect } = require('chai');
const CloseOperationCommand = require('../../../../dist/hive/Commands/CloseOperationCommand').default;

const requestMock = {
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: 0,
        modifiedRowCount: 0
    },
};

const TCLIService_types = {
    TCloseOperationReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
};
const thriftClientMock = {
    CloseOperation(request, callback) {
        return callback(null, responseMock);
    }
};

describe('CloseOperationCommand', () => {
    it('should return response', (cb) => {
        const command = new CloseOperationCommand(
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
