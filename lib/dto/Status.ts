import StatusError from "../errors/StatusError";

type StatusData = {
    success: boolean,
    error: boolean,
    executing: boolean,
    infoMessages: Array<string>,
    statusError: StatusError,
};

export default class Status {
    private isSuccess: boolean;
    private isError: boolean;
    private isExecuting: boolean;
    private infoMessages: Array<string>;
    private statusError: StatusError;

    constructor(data: StatusData) {
        this.isSuccess = data.success;
        this.isError = data.error;
        this.isExecuting = data.executing;
        this.infoMessages = data.infoMessages;
        this.statusError = data.statusError;
    }

    success(): boolean {
        return this.isSuccess;
    }

    error(): boolean {
        return this.isError;
    }

    executing(): boolean {
        return this.isExecuting;
    }

    getError(): StatusError {
        return this.statusError;
    }

    getInfo(): Array<string> {
        return this.infoMessages;
    }
}