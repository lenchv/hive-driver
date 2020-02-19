type StatusData = {
    success: boolean,
    executing: boolean,
    infoMessages: Array<string>,
};

export default class Status {
    private isSuccess: boolean;
    private isExecuting: boolean;
    private infoMessages: Array<string>;

    constructor(data: StatusData) {
        this.isSuccess = data.success;
        this.isExecuting = data.executing;
        this.infoMessages = data.infoMessages;
    }

    success(): boolean {
        return this.isSuccess;
    }

    executing(): boolean {
        return this.isExecuting;
    }

    getInfo(): Array<string> {
        return this.infoMessages;
    }
}