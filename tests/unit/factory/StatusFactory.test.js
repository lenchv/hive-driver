const { expect } = require('chai');
const TCLIService_type = require('../../../thrift/gen-nodejs/TCLIService_types');
const StatusFactory = require('../../../dist/factory/StatusFactory').default;

const statusFactory = new StatusFactory(TCLIService_type);

describe('StatusFactory', () => {
    it('should be success', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_type.TStatusCode.SUCCESS_STATUS
        });

        expect(status.success()).to.be.true;
        expect(status.error()).to.be.false;
        expect(status.executing()).to.be.false;
    });
    
    it('should be success and have info messages', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_type.TStatusCode.SUCCESS_WITH_INFO_STATUS,
            infoMessages: [ 'message1', 'message2' ]
        });

        expect(status.success()).to.be.true;
        expect(status.error()).to.be.false;
        expect(status.executing()).to.be.false;
        expect(status.getInfo()).to.be.deep.eq([ 'message1', 'message2' ]);
    });

    it('should be executing', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_type.TStatusCode.STILL_EXECUTING_STATUS
        });

        expect(status.success()).to.be.false;
        expect(status.error()).to.be.false;
        expect(status.executing()).to.be.true;
    });

    it('should have an error', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_type.TStatusCode.ERROR_STATUS,
            errorMessage: 'error',
            errorCode: 1,
            infoMessages: ['line1', 'line2']
        });

        expect(status.success()).to.be.false;
        expect(status.error()).to.be.true;
        expect(status.executing()).to.be.false;

        expect(status.getError()).to.be.deep.eq({
            name: 'Status Error',
            message: 'error',
            code: 1,
            stack: 'line1\nline2'
        });
    });

    it('should be set as error if handling invalid', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_type.TStatusCode.INVALID_HANDLE_STATUS
        });

        expect(status.success()).to.be.false;
        expect(status.error()).to.be.true;
        expect(status.executing()).to.be.false;
    });
});
