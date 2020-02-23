import HiveDriverError from "./HiveDriverError";
import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";
export default class OperationStateError extends HiveDriverError {
    response?: GetOperationStatusResponse;
    setResponse(response: GetOperationStatusResponse): void;
}
