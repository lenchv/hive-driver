import { TCLIServiceTypes, ThriftResponse } from "../ThriftService";
import { ThriftClient } from '../../hive/Types/';
export default class FetchResult {
    private TCLIService_types;
    private client;
    private response;
    private limit;
    constructor(TCLIService_types: TCLIServiceTypes, client: ThriftClient, response: ThriftResponse, limit?: number);
    execute(): Promise<any>;
    private getResult;
    private first;
    private next;
    private fetchResults;
}
