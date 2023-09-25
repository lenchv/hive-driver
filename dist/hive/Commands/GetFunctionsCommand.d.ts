import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export type GetFunctionsRequest = {
    sessionHandle: SessionHandle;
    catalogName?: string;
    schemaName?: string;
    functionName: string;
};
export type GetFunctionsResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetFunctionsCommand extends BaseCommand {
    execute(data: GetFunctionsRequest): Promise<GetFunctionsResponse>;
}
