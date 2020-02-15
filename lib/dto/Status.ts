import { TCLIServiceTypes, Status as TStatus } from "../hive/Types";

type StatusError = {
    message: string,
    code: number,
    stack: Array<string>,
};

export default class Status {
    private status: TStatus;
    private TCLIService_types: TCLIServiceTypes;

    constructor(status: TStatus, TCLIService_types: TCLIServiceTypes) {
        this.status = status;
        this.TCLIService_types = TCLIService_types;
    }

    success(): boolean {
        return (
            this.status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_STATUS
            || this.status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_WITH_INFO_STATUS
        );
    }

    error(): boolean {
        return (
            this.status.statusCode === this.TCLIService_types.TStatusCode.ERROR_STATUS
            || this.status.statusCode === this.TCLIService_types.TStatusCode.INVALID_HANDLE_STATUS
        );
    }

    executing(): boolean {
        return this.status.statusCode === this.TCLIService_types.TStatusCode.STILL_EXECUTING_STATUS;
    }

    getError(): StatusError {
        return {
            message: this.status.errorMessage || '',
            stack: this.status.infoMessages || [],
            code: this.status.errorCode || -1,
        };
    }

    getInfo(): Array<string> {
        return this.status.infoMessages || [];
    }
}