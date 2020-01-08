import BaseCommand from "./BaseCommand";
import { OperationHandle } from "../Types";

export type GetQueryIdRequest = {
    operationHandle: OperationHandle,
};

export type GetQueryIdResponse = {
    queryId: string,
};

export default class GetQueryIdCommand extends BaseCommand {
    execute(data: GetQueryIdRequest): Promise<GetQueryIdResponse> {
        const request = new this.TCLIService_types.TGetQueryIdReq(data);

        return this.executeCommand<GetQueryIdResponse>(request, this.client.GetQueryId);
    }   
}
