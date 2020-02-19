import { TCLIServiceTypes, Status as TStatus } from "../hive/Types";
import Status from "../dto/Status";
export default class StatusFactory {
    private TCLIService_types;
    constructor(TCLIService_types: TCLIServiceTypes);
    /**
     * @param status thrift status object from API responses
     * @throws {StatusError}
     */
    create(status: TStatus): Status;
    private isSuccess;
    private isError;
    private isExecuting;
}
