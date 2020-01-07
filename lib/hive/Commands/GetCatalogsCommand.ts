import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";

export type GetCatalogsRequest = {
    sessionHandle: SessionHandle
};

export type GetCatalogsResponse = {
    status: Status,
    operationHandle: OperationHandle
};

export default class GetCatalogsCommand extends BaseCommand {
    execute(data: GetCatalogsRequest): Promise<GetCatalogsResponse> {
        const request = new this.TCLIService_types.TGetCatalogsReq(data);

        return this.executeCommand<GetCatalogsResponse>(request, this.client.GetCatalogs);
    }   
}
