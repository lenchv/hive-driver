import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";
import Status from "../dto/Status";
import OperationResult from "../dto/OperationResult";
export default interface IOperation {
    fetch(): Promise<Status>;
    status(progress: boolean): Promise<GetOperationStatusResponse>;
    cancel(): Promise<Status>;
    close(): Promise<Status>;
    waitUntilReady(progress: boolean, callback: Function): void;
    finished(): boolean;
    hasMoreRows(): boolean;
    result(): OperationResult | null;
}
