import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";
import Status from "../dto/Status";
import IOperationResult from "../result/IOperationResult";
export default interface IOperation {
    fetch(): Promise<Status>;
    status(progress: boolean): Promise<GetOperationStatusResponse>;
    cancel(): Promise<Status>;
    close(): Promise<Status>;
    waitUntilReady(progress: boolean, callback: Function): void;
    finished(): boolean;
    hasMoreRows(): boolean;
    result(): IOperationResult;
    getQueryId(): Promise<string>;
}
