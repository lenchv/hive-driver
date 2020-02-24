import HiveDriverError from "./HiveDriverError";
import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";
export default class OperationStateError extends HiveDriverError {
    response: GetOperationStatusResponse;
    constructor(message: string, response: GetOperationStatusResponse);
}
