import { ThriftClient, TCLIServiceTypes, SessionHandle, Status } from "../Types";
import BaseCommand from "./BaseCommand";

export type CloseSessionRequest = {
    sessionHandle: SessionHandle
};

export type CloseSessionResponse = {
    status: Status
};

export default class CloseSessionCommand extends BaseCommand {
    execute(openSessionRequest: CloseSessionRequest): Promise<CloseSessionResponse> {
        const request = new this.TCLIService_types.TCloseSessionReq(openSessionRequest);

        return this.executeCommand<CloseSessionResponse>(request, this.client.CloseSession);
    }
}
