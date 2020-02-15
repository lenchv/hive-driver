import BaseCommand from "./BaseCommand";
import { Status, SessionHandle } from "../Types";
export declare type GetDelegationTokenRequest = {
    sessionHandle: SessionHandle;
    owner: string;
    renewer: string;
};
export declare type GetDelegationTokenResponse = {
    status: Status;
    delegationToken?: string;
};
export default class GetDelegationTokenCommand extends BaseCommand {
    execute(data: GetDelegationTokenRequest): Promise<GetDelegationTokenResponse>;
}
