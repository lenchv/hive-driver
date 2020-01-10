import { TCLIServiceTypes, Status as TStatus } from "../hive/Types";
import Status from "../dto/Status";

export default class StatusFactory {
    private TCLIService_type: TCLIServiceTypes

    constructor(TCLIService_type: TCLIServiceTypes) {
        this.TCLIService_type = TCLIService_type;
    }

    create(status: TStatus): Status {
        return new Status(
            status,
            this.TCLIService_type
        );
    }
}
