import { TCLIServiceTypes, Status as TStatus } from "../hive/Types";
import Status from "../dto/Status";
import StatusError from "../errors/StatusError";

export default class StatusFactory {
    private TCLIService_types: TCLIServiceTypes

    constructor(TCLIService_types: TCLIServiceTypes) {
        this.TCLIService_types = TCLIService_types;
    }

    /**
     * @param status thrift status object from API responses
     * @throws {StatusError}
     */
    create(status: TStatus): Status {
        if (this.isError(status)) {
            throw new StatusError(status);
        }
        
        return new Status({
            success: this.isSuccess(status),
            executing: this.isExecuting(status),
            infoMessages: status.infoMessages || [],
        });
    }

    private isSuccess(status: TStatus): boolean {
        return (
            status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_STATUS
            || status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_WITH_INFO_STATUS
        );
    }

    private isError(status: TStatus): boolean {
        return (
            status.statusCode === this.TCLIService_types.TStatusCode.ERROR_STATUS
            || status.statusCode === this.TCLIService_types.TStatusCode.INVALID_HANDLE_STATUS
        );
    }

    private isExecuting(status: TStatus): boolean {
        return status.statusCode === this.TCLIService_types.TStatusCode.STILL_EXECUTING_STATUS;
    }
}
