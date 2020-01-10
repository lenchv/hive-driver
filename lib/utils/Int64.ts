import { ThriftBuffer } from "../hive/Types";

const NodeInt64 = require('node-int64');

export default class Int64 {
    private value: ThriftBuffer;
    
    constructor(value: ThriftBuffer) {
        this.value = value;
    }

    getValue(): number {
        const result = new NodeInt64(this.value);
        
        return result.toNumber();
    }

    getRawValue(): ThriftBuffer {
        return this.value;
    }

    getInt64(): any {
        return new NodeInt64(this.value);
    }
}