/// <reference types="node" />
import { GetInfoValue } from "../hive/Types";
declare type InfoResultType = string | number | Buffer | null;
export default class InfoValue {
    private value;
    constructor(value: GetInfoValue);
    getValue(): InfoResultType;
}
export {};
