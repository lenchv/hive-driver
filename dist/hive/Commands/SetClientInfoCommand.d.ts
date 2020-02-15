import BaseCommand from "./BaseCommand";
import { SessionHandle, Status } from "../Types";
export declare type SetClientInfoRequest = {
    sessionHandle: SessionHandle;
    configuration?: Map<string, string>;
};
export declare type SetClientInfoResponse = {
    status: Status;
};
export default class SetClientInfoCommand extends BaseCommand {
    execute(data: SetClientInfoRequest): Promise<SetClientInfoResponse>;
}
