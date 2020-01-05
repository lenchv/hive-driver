import ThriftService, { ThriftResponse, ResultSetMetadataResponse } from "./hive/ThriftService";

export type ExecuteStatementResult = {
    data: Array<any>,
    schema: ResultSetMetadataResponse
};

export default class ExecuteStatementResponse {
    private response: ThriftResponse;
    private thriftService: ThriftService;
    private data: Array<any>;
    private schema: ResultSetMetadataResponse | null;

    constructor(response: ThriftResponse, thriftService: ThriftService) {
        this.response = response;
        this.thriftService = thriftService;

        this.data = [];
        this.schema = null;
    }

    create(): Promise<ExecuteStatementResult> {
        return Promise.resolve()
            .then(() => this.fetchData())
            .then(() => this.fetchSchema())
            .then(() => this.combine());
    }

    private combine(): ExecuteStatementResult {
        return {
            data: this.data,
            schema: this.schema || {
                status: {}
            },
        };
    }

    private fetchData(): Promise<Array<any>> {
        return this.thriftService.fetchResult(this.response)
            .then(data => {
                this.data = data;

                return data;
            });
    }

    private fetchSchema(): Promise<ResultSetMetadataResponse> {
        return this.thriftService.getResultSetMetadata(this.response)
            .then((schema: ResultSetMetadataResponse) => {
                this.schema = schema;

                return schema;
            });
    }
}