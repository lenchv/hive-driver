import { TCLIServiceTypes, Status as TStatus } from "../hive/Types";
declare type StatusError = {
    message: string;
    code: number;
    stack: Array<string>;
};
export default class Status {
    private status;
    private TCLIService_types;
    constructor(status: TStatus, TCLIService_types: TCLIServiceTypes);
    success(): boolean;
    error(): boolean;
    executing(): boolean;
    getError(): StatusError;
    getInfo(): Array<string>;
}
export {};
