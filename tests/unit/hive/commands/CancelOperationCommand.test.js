const { expect } = require('chai');
const CancelOperationCommand = require('../../../../dist/hive/Commands/CancelOperationCommand').default;

const requestMock = {
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: 0,
        modifiedRowCount: 0
    },
};

const TCLIService_types = {
    TCancelOperationReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
};
const thriftClientMock = {
    CancelOperation(request, callback) {
        return callback(null, responseMock);
    }
};

describe('CancelOperationCommand', () => {
    it('should return response', (cb) => {
        const command = new CancelOperationCommand(
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
