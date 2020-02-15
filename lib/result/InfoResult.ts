import Status from "../dto/Status";
import InfoValue from "../dto/InfoValue";
import { GetInfoResponse } from "../hive/Commands/GetInfoCommand";
import { TCLIServiceTypes } from "../hive/Types";

export default class InfoResult {
    public status: Status;
    public value: InfoValue;

    constructor(response: GetInfoResponse, TCLIService_types: TCLIServiceTypes) {
        this.status = new Status(
            response.status,
            TCLIService_types
        );
        this.value = new InfoValue(response.infoValue);
    }
}
