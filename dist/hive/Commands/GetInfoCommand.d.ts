import BaseCommand from "./BaseCommand";
import { Status, GetInfoValue, SessionHandle } from "../Types";
/**
 * @param infoType TCLISErvice_types.TGetInfoType
 */
export type GetInfoRequest = {
    sessionHandle: SessionHandle;
    infoType: number;
};
export type GetInfoResponse = {
    status: Status;
    infoValue: GetInfoValue;
};
export default class GetInfoCommand extends BaseCommand {
    execute(data: GetInfoRequest): Promise<GetInfoResponse>;
}
