import BaseCommand from "./BaseCommand";
import { Status, SessionHandle } from "../Types";

export type GetDelegationTokenRequest = {
    sessionHandle: SessionHandle,
    owner: string,
    renewer: string,
};

export type GetDelegationTokenResponse = {
    status: Status,
    delegationToken?: string,
};

export default class GetDelegationTokenCommand extends BaseCommand {
    execute(data: GetDelegationTokenRequest): Promise<GetDelegationTokenResponse> {
        const request = new this.TCLIService_types.TGetDelegationTokenReq(data);

        return this.executeCommand<GetDelegationTokenResponse>(request, this.client.GetDelegationToken);
    }   
}
