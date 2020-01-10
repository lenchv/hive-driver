const { expect } = require('chai');
const TCLIService_type = require('../../thrift/gen-nodejs/TCLIService_types');
const Status = require('../../dist/dto/Status').default;

describe('Status', () => {
    it('should be success', () => {
        const status = new Status({
            statusCode: TCLIService_type.TStatusCode.SUCCESS_STATUS
        }, TCLIService_type);

        expect(status.success()).to.be.true;
        expect(status.error()).to.be.false;
        expect(status.executing()).to.be.false;
    });
    
    it('should be success and have info messages', () => {
        const status = new Status({
            statusCode: TCLIService_type.TStatusCode.SUCCESS_WITH_INFO_STATUS,
            infoMessages: [ 'message1', 'message2' ]
        }, TCLIService_type);

        expect(status.success()).to.be.true;
        expect(status.error()).to.be.false;
        expect(status.executing()).to.be.false;
        expect(status.getInfo()).to.be.deep.eq([ 'message1', 'message2' ]);
    });

    it('should be executing', () => {
        const status = new Status({
            statusCode: TCLIService_type.TStatusCode.STILL_EXECUTING_STATUS
        }, TCLIService_type);

        expect(status.success()).to.be.false;
        expect(status.error()).to.be.false;
        expect(status.executing()).to.be.true;
    });

    it('should have an error', () => {
        const status = new Status({
            statusCode: TCLIService_type.TStatusCode.ERROR_STATUS,
            errorMessage: 'error',
            errorCode: 1,
            infoMessages: ['error']
        }, TCLIService_type);

        expect(status.success()).to.be.false;
        expect(status.error()).to.be.true;
        expect(status.executing()).to.be.false;

        expect(status.getError()).to.be.deep.eq({
            message: 'error',
            code: 1,
            stack: ['error']
        });
    });

    it('should be set as error if handling invalid', () => {
        const status = new Status({
            statusCode: TCLIService_type.TStatusCode.INVALID_HANDLE_STATUS
        }, TCLIService_type);

        expect(status.success()).to.be.false;
        expect(status.error()).to.be.true;
        expect(status.executing()).to.be.false;
    });
});
