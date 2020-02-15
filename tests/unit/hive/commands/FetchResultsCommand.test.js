const { expect } = require('chai');
const FetchResultsCommand = require('../../../../dist/hive/Commands/FetchResultsCommand').default;

const requestMock = {
    operationHandle: {
        sessionId: { guid: '', secret: '' }
    },
    orientation: 0,
    maxRows: 100,
    fetchType: 0
};

const TCLIService_types = {
    TFetchResultsReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const responseMock = {
    status: { statusCode: 0 },
    hasMoreRows: false,
    results: {
        startRowOffset: 0,
        rows: [{
            colVals: [true, 'value']
        }],
        columns: [{
            values: [true]
        }, {
            values: ['value']
        }],
        binaryColumns: Buffer.from([]),
        columnCount: 2
    }
};
const thriftClientMock = {
    FetchResults(request, callback) {
        return callback(null, responseMock);
    }
};

describe('FetchResultsCommand', () => {
    it('should return response', (cb) => {
        const command = new FetchResultsCommand(
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
