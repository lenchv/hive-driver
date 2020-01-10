/// <reference types="node" />
import { GetInfoValue } from "../hive/Types";
export default class InfoValue {
    private value;
    constructor(value: GetInfoValue);
    getValue(): string | number | Buffer | null;
}
