const { expect } = require('chai');
const InfoValue = require('../../../dist/dto/InfoValue').default;
const NodeInt64 = require('node-int64');

describe('InfoValue', () => {
    const infoValue = (value) => Object.assign({
        stringValue: null,
        smallIntValue: null,
        integerBitmask: null,
        integerFlag: null,
        lenValue: null,
    }, value);
    
    it('should return string', () => {
        const value = new InfoValue(infoValue({
            stringValue: 'value'
        }));

        expect(value.getValue()).to.be.eq('value');
    });

    it('should return number', () => {
        const smallInt = new InfoValue(infoValue({
            smallIntValue: 1
        }));

        expect(smallInt.getValue()).to.be.eq(1);

        const bitMask = new InfoValue(infoValue({
            integerBitmask: 0xaa55aa55
        }));

        expect(bitMask.getValue()).to.be.eq(0xaa55aa55);        

        const integerFlag = new InfoValue(infoValue({
            integerFlag: 0x01
        }));

        expect(integerFlag.getValue()).to.be.eq(01);
    });

    it('should return int64', () => {
        const value = new InfoValue(infoValue({
            lenValue: new NodeInt64(Buffer.from([ 0x00, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10]))
        }));

        expect(value.getValue()).to.be.instanceOf(NodeInt64);
        expect(value.getValue().toNumber()).to.be.eq(4521260802379792);
    });
});
