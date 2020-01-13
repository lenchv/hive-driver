/// <reference types="node" />
export declare enum StatusCode {
    START = 1,
    OK = 2,
    BAD = 3,
    ERROR = 4,
    COMPLETE = 5
}
export default class AuthHelper {
    static createPackage(status: StatusCode, body: Buffer): Buffer;
}
