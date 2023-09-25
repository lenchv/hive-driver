import { SessionHandle, Status } from "../Types";
import BaseCommand from "./BaseCommand";
export type CloseSessionRequest = {
    sessionHandle: SessionHandle;
};
export type CloseSessionResponse = {
    status: Status;
};
export default class CloseSessionCommand extends BaseCommand {
    execute(openSessionRequest: CloseSessionRequest): Promise<CloseSessionResponse>;
}
