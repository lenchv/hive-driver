const { expect } = require('chai');
const GetResult = require('../../../dist/utils/GetResult').default;
const NullResult = require('../../../dist/result/NullResult').default;
const JsonResult = require('../../../dist/result/JsonResult').default;

describe('GetResult', () => {
    it('should return null result', () => {
        const t = new GetResult({
            getSchema: () => null
        });
        expect(t.execute()).instanceOf(NullResult);
    });
    it('should return json result', () => {
        const t = new GetResult({
            getSchema: () => {},
            getData: () => []
        });
        expect(t.execute()).instanceOf(JsonResult);
    });
    it('should return custom result', () => {
        const customResult = {
            setOperation() {
                this.executed = true;
            }
        };
        const t = new GetResult({});
        expect(t.execute(customResult)).to.be.eq(customResult);
        expect(customResult.executed).to.be.true;
    });
});