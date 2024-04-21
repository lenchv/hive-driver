/// <reference types="node" />
import BaseCommand from "./BaseCommand";
import { OperationHandle, SessionHandle, Status } from "../Types";
export type UploadDataRequest = {
    sessionHandle: SessionHandle;
    tableName?: string;
    path?: string;
    values: Buffer;
};
export type UploadDataResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class UploadDataCommand extends BaseCommand {
    execute(data: UploadDataRequest): Promise<UploadDataResponse>;
}
