import Status from "../dto/Status";
import InfoValue from "../dto/InfoValue";
import { GetInfoResponse } from "../hive/Commands/GetInfoCommand";
import { TCLIServiceTypes } from "../hive/Types";
export default class InfoResult {
    status: Status;
    value: InfoValue;
    constructor(response: GetInfoResponse, TCLIService_types: TCLIServiceTypes);
}
