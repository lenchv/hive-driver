const { expect } = require('chai');
const HiveUtils = require('../../../dist/utils/HiveUtils').default;
const NullResult = require('../../../dist/result/NullResult').default;
const { TCLIService_types } = require('../../../').thrift;

describe('HiveUtils', () => {
    it('waitUntilReady', () => {
        const operation = {
            status: () => Promise.resolve({
                operationState: 2
            })
        };
        const utils = new HiveUtils(TCLIService_types);
        let executed = false;

        return utils.waitUntilReady(operation, true, () => {
            executed = true;
        }).then((op) => {
            expect(executed).to.be.true;
            expect(op).to.be.eq(operation);
        });
    });

    it('getResult', () => {
        const utils = new HiveUtils(TCLIService_types);
        const result = utils.getResult({
            getSchema: () => null
        });
        expect(result).instanceOf(NullResult);
    });

    it('fetchAll', () => {
        const utils = new HiveUtils(TCLIService_types);
        const operation = {
            n: 0,
            _hasMoreRows: true,
            fetch() {
                this.n++;
                return Promise.resolve();
            },
            hasMoreRows() {
                const result = this._hasMoreRows;
                this._hasMoreRows = false;
                return result;
            }
        };
        return utils.fetchAll(operation).then((operation) => {
            expect(operation.n).to.be.eq(2);
        });
    });

    it('formatProgress', () => {
        const utils = new HiveUtils(TCLIService_types);
        const result = utils.formatProgress({
            headerNames: [],
            rows: []
        });
        expect(result).to.be.eq('\n');
    });
});
