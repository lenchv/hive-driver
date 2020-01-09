import ThriftService, { ThriftResponse, ResultSetMetadataResponse } from "./hive/ThriftService";
export declare type ExecuteStatementResult = {
    data: Array<any>;
    schema: ResultSetMetadataResponse;
};
export default class ExecuteStatementResponse {
    private response;
    private thriftService;
    private data;
    private schema;
    constructor(response: ThriftResponse, thriftService: ThriftService);
    create(): Promise<ExecuteStatementResult>;
    private combine;
    private fetchData;
    private fetchSchema;
}
