import BaseCommand from "./BaseCommand";
import { OperationHandle, SessionHandle, Status } from "../Types";

export type DownloadDataRequest = {
    sessionHandle: SessionHandle,
    tableName?: string,
    query?: string,
    format?: string,
    downloadOptions?: { [option: string]: string },
};

export type DownloadDataResponse = {
    status: Status,
    operationHandle: OperationHandle,
};

export default class DownloadDataCommand extends BaseCommand {
    execute(data: DownloadDataRequest): Promise<DownloadDataResponse> {
        const request = new this.TCLIService_types.TDownloadDataReq(data);

        return this.executeCommand<DownloadDataResponse>(request, this.client.DownloadData);
    }   
}
