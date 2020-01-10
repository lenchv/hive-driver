import { ThriftBuffer } from "../hive/Types";

const Big = require('big.js');

export default class Int64 {
    private value: ThriftBuffer;
    
    constructor(value: ThriftBuffer) {
        this.value = value;
    }

    getValue(): number {
        const result = this.toInt64(this.value.buffer, this.value.offset);
        const max = new Big(Number.MAX_SAFE_INTEGER);

        if (result.cmp(max) > 0) {
            return Number.MAX_SAFE_INTEGER;
        } else {
            return parseInt(result.toString());
        }
    }

    getRawValue(): ThriftBuffer {
        return this.value;
    }

    getBigValue(): any {
        return this.toInt64(this.value.buffer, this.value.offset);
    }

    private toInt64(buffer: any, offset: any): any {
        const b = buffer;
        const o = offset;
    
        const negate = b[o] & 0x80;
        let value = new Big(0);
        let m = new Big(1);
        let carry = 1;
    
        for (let i = 7; i >= 0; i -= 1) {
            let v = b[o + i];
    
            if (negate) {
                v = (v ^ 0xff) + carry;
                carry = v >> 8;
                v &= 0xff;
            }
    
            value = value.plus((new Big(v)).times(m));
            m = m.times(256);
        }
    
        if (negate) {
            value = value.times(-1);
        }
    
        return value;
    }
}