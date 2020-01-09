import BaseCommand from "./BaseCommand";
import { Status, SessionHandle } from "../Types";
export declare type RenewDelegationTokenRequest = {
    sessionHandle: SessionHandle;
    delegationToken: string;
};
export declare type RenewDelegationTokenResponse = {
    status: Status;
};
export default class RenewDelegationTokenCommand extends BaseCommand {
    execute(data: RenewDelegationTokenRequest): Promise<RenewDelegationTokenResponse>;
}
