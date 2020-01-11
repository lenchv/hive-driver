const { expect } = require('chai');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const WaitUntilReady = require('../../dist/utils/WaitUntilReady').default;

const operation = (state) => ({
    state,
    status() {
        return Promise.resolve({
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
        const execute = (state) => () => {
            const waitUntilReady = new WaitUntilReady(operation(state), TCLIService_types);
            return waitUntilReady.execute();
        };

        expect(execute(TCLIService_types.TOperationState.CANCELED_STATE)).throws;
        expect(execute(TCLIService_types.TOperationState.CLOSED_STATE)).throws;
        expect(execute(TCLIService_types.TOperationState.ERROR_STATE)).throws;
        expect(execute(TCLIService_types.TOperationState.PENDING_STATE)).throws;
        expect(execute(TCLIService_types.TOperationState.TIMEDOUT_STATE)).throws;
        expect(execute(TCLIService_types.TOperationState.UKNOWN_STATE)).throws;
    });
});
