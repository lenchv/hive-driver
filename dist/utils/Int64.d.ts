import { ThriftBuffer } from "../hive/Types";
export default class Int64 {
    private value;
    constructor(value: ThriftBuffer);
    getValue(): number;
    getRawValue(): ThriftBuffer;
    getInt64(): any;
}
