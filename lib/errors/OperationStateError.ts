import HiveDriverError from "./HiveDriverError";
import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";

export default class OperationStateError extends HiveDriverError {
    public response: GetOperationStatusResponse;

    constructor(message: string, response: GetOperationStatusResponse) {
        super(message);
    
        this.response = response;
    }
}