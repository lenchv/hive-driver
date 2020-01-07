import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";

export type GetTableTypesRequest = {
    sessionHandle: SessionHandle,
};

export type GetTableTypesResponse = {
    status: Status,
    operationHandle: OperationHandle
};

export default class GetTableTypesCommand extends BaseCommand {
    execute(data: GetTableTypesRequest): Promise<GetTableTypesResponse> {
        const request = new this.TCLIService_types.TGetTableTypesReq(data);

        return this.executeCommand<GetTableTypesResponse>(request, this.client.GetTableTypes);
    }   
}
