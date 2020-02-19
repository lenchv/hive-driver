declare type StatusData = {
    success: boolean;
    executing: boolean;
    infoMessages: Array<string>;
};
export default class Status {
    private isSuccess;
    private isExecuting;
    private infoMessages;
    constructor(data: StatusData);
    success(): boolean;
    executing(): boolean;
    getInfo(): Array<string>;
}
export {};
