const { expect } = require('chai');
const { TCLIService_types } = require('../../../').thrift;
const WaitUntilReady = require('../../../dist/utils/WaitUntilReady').default;

const operation = (state) => ({
    state,
    status() {
        return Promise.resolve({
            type: 'GetOperationStatusResponse',
            operationState: this.state
        });
    }
});

describe('WaitUntilReady', () => {
    it('should return operation when state is finished', (cb) => {
        const op = operation(TCLIService_types.TOperationState.FINISHED_STATE);
        const waitUntilReady = new WaitUntilReady(op, TCLIService_types);

        waitUntilReady.execute().then(() => {
            expect(op).to.be.eq(op);
            cb();
        }).catch(cb)
    });

    it('should call callback until state is not finished', (cb) => {
        const op = operation(TCLIService_types.TOperationState.INITIALIZED_STATE);
        const waitUntilReady = new WaitUntilReady(op, TCLIService_types);
        let states = [
            TCLIService_types.TOperationState.INITIALIZED_STATE,
            TCLIService_types.TOperationState.RUNNING_STATE,
            TCLIService_types.TOperationState.FINISHED_STATE,
        ];
        let i = 0; 

        waitUntilReady.execute(false, (response) => {
            expect(response.operationState).to.be.eq(states[i]);
            op.state = states[++i];
        }).then(() => {
            cb();
        }).catch(cb)
    });

    it('should throw error if state is invalid', () => {
        const execute = (state) => {
            const waitUntilReady = new WaitUntilReady(operation(state), TCLIService_types);
            return waitUntilReady.execute();
        };

        return Promise.all([
            execute(TCLIService_types.TOperationState.CANCELED_STATE).catch(error => {
                expect(error.message).to.be.eq('The operation was canceled by a client');
                expect(error.response.type).to.be.eq('GetOperationStatusResponse');
            }),
            execute(TCLIService_types.TOperationState.CLOSED_STATE).catch(error => {
                expect(error.message).to.be.eq('The operation was closed by a client');
                expect(error.response.type).to.be.eq('GetOperationStatusResponse');
            }),
            execute(TCLIService_types.TOperationState.ERROR_STATE).catch(error => {
                expect(error.message).to.be.eq('The operation failed due to an error');
                expect(error.response.type).to.be.eq('GetOperationStatusResponse');
            }),
            execute(TCLIService_types.TOperationState.PENDING_STATE).catch(error => {
                expect(error.message).to.be.eq('The operation is in a pending state');
                expect(error.response.type).to.be.eq('GetOperationStatusResponse');
            }),
            execute(TCLIService_types.TOperationState.TIMEDOUT_STATE).catch(error => {
                expect(error.message).to.be.eq('The operation is in a timedout state');
                expect(error.response.type).to.be.eq('GetOperationStatusResponse');
            }),
            execute(TCLIService_types.TOperationState.UKNOWN_STATE).catch(error => {
                expect(error.message).to.be.eq('The operation is in an unrecognized state');
                expect(error.response.type).to.be.eq('GetOperationStatusResponse');
            }),
        ]);
    });

    it('should wait untill callback will be finished', () => {
        const op = operation(TCLIService_types.TOperationState.INITIALIZED_STATE);
        const waitUntilReady = new WaitUntilReady(op, TCLIService_types);
        let i = 0;

        return waitUntilReady.execute(false, (response) => {
            op.state = TCLIService_types.TOperationState.FINISHED_STATE;

            return Promise.resolve()
                .then(() => new Promise((resolve) => {
                    setTimeout(() => {
                        expect(i == 0 || i === 2).to.be.true;
                        i++;
                        resolve();
                    }, 10);
                }))
                .then(() => new Promise((resolve) => {
                    setTimeout(() => {
                        expect(i == 1 || i === 3).to.be.true;
                        i++;
                        resolve();
                    }, 30);
                }));
        }).then(() => {
            expect(i).to.be.eq(4);
        });
    });
});
