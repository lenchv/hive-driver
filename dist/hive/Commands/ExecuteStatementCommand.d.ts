/// <reference types="node" />
import { SessionHandle, Status, OperationHandle } from "../Types";
import BaseCommand from "./BaseCommand";
export declare type ExecuteStatementRequest = {
    sessionHandle: SessionHandle;
    statement: string;
    confOverlay?: Map<string, string>;
    runAsync?: boolean;
    queryTimeout?: Buffer;
};
export declare type ExecuteStatementResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class ExecuteStatementCommand extends BaseCommand {
    execute(executeStatementRequest: ExecuteStatementRequest): Promise<ExecuteStatementResponse>;
}
