import BaseCommand from "./BaseCommand";
import { Status, SessionHandle } from "../Types";
export type RenewDelegationTokenRequest = {
    sessionHandle: SessionHandle;
    delegationToken: string;
};
export type RenewDelegationTokenResponse = {
    status: Status;
};
export default class RenewDelegationTokenCommand extends BaseCommand {
    execute(data: RenewDelegationTokenRequest): Promise<RenewDelegationTokenResponse>;
}
