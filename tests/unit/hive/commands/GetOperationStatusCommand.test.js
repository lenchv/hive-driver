const { expect } = require('chai');
const GetOperationStatusCommand = require('../../../../dist/hive/Commands/GetOperationStatusCommand').default;

const requestMock = {
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: 0,
        modifiedRowCount: 0
    },
    getProgressUpdate: true
};

const TCLIService_types = {
    TGetOperationStatusReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
    operationState: 2,
    sqlState: '',
    errorCode: 0,
    errorMessage: '',
    taskStatus: '',
    operationStarted: Buffer.from([]),
    operationCompleted: Buffer.from([]),
    hasResultSet: true,
    progressUpdateResponse: {
        headerNames: [''],
        rows: [['']],
        progressedPercentage: 50,
        status: 0,
        footerSummary: '',
        startTime: Buffer.from([])
    },
    numModifiedRows: Buffer.from([]),
};
const thriftClientMock = {
    GetOperationStatus(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetOperationStatusCommand', () => {
    it('should return response', (cb) => {
        const command = new GetOperationStatusCommand(
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
