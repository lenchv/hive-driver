import { SessionHandle, Status } from "../Types";
import BaseCommand from "./BaseCommand";
export declare type CloseSessionRequest = {
    sessionHandle: SessionHandle;
};
export declare type CloseSessionResponse = {
    status: Status;
};
export default class CloseSessionCommand extends BaseCommand {
    execute(openSessionRequest: CloseSessionRequest): Promise<CloseSessionResponse>;
}
