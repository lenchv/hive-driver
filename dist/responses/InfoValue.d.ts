import { GetInfoResponse } from "../hive/Commands/GetInfoCommand";
import Int64 from "../utils/Int64";
export default class InfoValue {
    private response;
    constructor(response: GetInfoResponse);
    getValue(): string | number | Int64 | null;
}
