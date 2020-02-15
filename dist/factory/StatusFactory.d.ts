import { TCLIServiceTypes, Status as TStatus } from "../hive/Types";
import Status from "../dto/Status";
export default class StatusFactory {
    private TCLIService_type;
    constructor(TCLIService_type: TCLIServiceTypes);
    create(status: TStatus): Status;
}
