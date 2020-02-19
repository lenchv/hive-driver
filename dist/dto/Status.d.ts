import StatusError from "../errors/StatusError";
declare type StatusData = {
    success: boolean;
    error: boolean;
    executing: boolean;
    infoMessages: Array<string>;
    statusError: StatusError;
};
export default class Status {
    private isSuccess;
    private isError;
    private isExecuting;
    private infoMessages;
    private statusError;
    constructor(data: StatusData);
    success(): boolean;
    error(): boolean;
    executing(): boolean;
    getError(): StatusError;
    getInfo(): Array<string>;
}
export {};
