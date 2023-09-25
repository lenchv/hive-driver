/// <reference types="node" />
import { SessionHandle, Status, OperationHandle } from "../Types";
import BaseCommand from "./BaseCommand";
export type ExecuteStatementRequest = {
    sessionHandle: SessionHandle;
    statement: string;
    confOverlay?: Map<string, string>;
    runAsync?: boolean;
    queryTimeout?: Buffer;
};
export type ExecuteStatementResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class ExecuteStatementCommand extends BaseCommand {
    execute(executeStatementRequest: ExecuteStatementRequest): Promise<ExecuteStatementResponse>;
}
