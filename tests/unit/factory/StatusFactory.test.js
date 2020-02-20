const { expect } = require('chai');
const { TCLIService_types } = require('../../../').thrift;
const StatusFactory = require('../../../dist/factory/StatusFactory').default;

const statusFactory = new StatusFactory(TCLIService_types);

describe('StatusFactory', () => {
    it('should be success', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_types.TStatusCode.SUCCESS_STATUS
        });

        expect(status.success()).to.be.true;
        expect(status.executing()).to.be.false;
    });
    
    it('should be success and have info messages', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_types.TStatusCode.SUCCESS_WITH_INFO_STATUS,
            infoMessages: [ 'message1', 'message2' ]
        });

        expect(status.success()).to.be.true;
        expect(status.executing()).to.be.false;
        expect(status.getInfo()).to.be.deep.eq([ 'message1', 'message2' ]);
    });

    it('should be executing', () => {
        const status = statusFactory.create({
            statusCode: TCLIService_types.TStatusCode.STILL_EXECUTING_STATUS
        });

        expect(status.success()).to.be.false;
        expect(status.executing()).to.be.true;
    });

    it('should have an error', () => {
        const error = expect(() => {
            statusFactory.create({
                statusCode: TCLIService_types.TStatusCode.ERROR_STATUS,
                errorMessage: 'error',
                errorCode: 1,
                infoMessages: ['line1', 'line2']
            });
        }).to.throw('error');
        error.with.property('stack', 'line1\nline2')
        error.with.property('code', 1);
        error.with.property('name', 'Status Error');
    });

    it('should be set as error if handling invalid', () => {
        const error = expect(() => {
            statusFactory.create({
                statusCode: TCLIService_types.TStatusCode.INVALID_HANDLE_STATUS,
                errorMessage: 'error',
            });
        }).to.throw('error');
        error.with.property('name', 'Status Error');
        error.with.property('message', 'error');
        error.with.property('code', -1);;
    });
});
