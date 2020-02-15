const { expect } = require('chai');
const GetCatalogsCommand = require('../../../../dist/hive/Commands/GetCatalogsCommand').default;

const requestMock = {
    sessionHandle: {
        sessionId: { guid: '', secret: '' }
    }
};

const TCLIService_types = {
    TGetCatalogsReq: function (options) {
        this.options = options;

        expect(options).to.be.deep.eq(requestMock);
    }
};

const GET_CATALOG = 2;

const responseMock = {
    status: { statusCode: 0 },
    operationHandle: {
        hasResultSet: true,
        operationId: { guid: '', secret: '' },
        operationType: GET_CATALOG,
        modifiedRowCount: 0
    }
};
const thriftClientMock = {
    GetCatalogs(request, callback) {
        return callback(null, responseMock);
    }
};

describe('GetCatalogsCommand', () => {
    it('should return response', (cb) => {
        const command = new GetCatalogsCommand(
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
