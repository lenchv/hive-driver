import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetCatalogsRequest = {
    sessionHandle: SessionHandle;
};
export declare type GetCatalogsResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetCatalogsCommand extends BaseCommand {
    execute(data: GetCatalogsRequest): Promise<GetCatalogsResponse>;
}
