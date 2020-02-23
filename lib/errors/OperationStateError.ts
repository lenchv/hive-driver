import HiveDriverError from "./HiveDriverError";
import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";

export default class OperationStateError extends HiveDriverError {
    public response?: GetOperationStatusResponse;

    setResponse(response: GetOperationStatusResponse) {
        this.response = response;
    }
}