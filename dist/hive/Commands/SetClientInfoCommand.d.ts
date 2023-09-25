import BaseCommand from "./BaseCommand";
import { SessionHandle, Status } from "../Types";
export type SetClientInfoRequest = {
    sessionHandle: SessionHandle;
    configuration?: Map<string, string>;
};
export type SetClientInfoResponse = {
    status: Status;
};
export default class SetClientInfoCommand extends BaseCommand {
    execute(data: SetClientInfoRequest): Promise<SetClientInfoResponse>;
}
