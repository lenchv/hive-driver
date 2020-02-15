import BaseCommand from "./BaseCommand";
import { OperationHandle } from "../Types";
export declare type GetQueryIdRequest = {
    operationHandle: OperationHandle;
};
export declare type GetQueryIdResponse = {
    queryId: string;
};
export default class GetQueryIdCommand extends BaseCommand {
    execute(data: GetQueryIdRequest): Promise<GetQueryIdResponse>;
}
