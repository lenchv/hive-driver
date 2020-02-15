import BaseCommand from "./BaseCommand";
import { Status, SessionHandle } from "../Types";
export declare type CancelDelegationTokenRequest = {
    sessionHandle: SessionHandle;
    delegationToken: string;
};
export declare type CancelDelegationTokenResponse = {
    status: Status;
};
export default class CancelDelegationTokenCommand extends BaseCommand {
    execute(data: CancelDelegationTokenRequest): Promise<CancelDelegationTokenResponse>;
}
