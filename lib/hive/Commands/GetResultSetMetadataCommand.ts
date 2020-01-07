import { ThriftClient, TCLIServiceTypes, TableSchema, Status, OperationHandle } from "../Types";

export type GetResultSetMetadataRequest = {
    operationHandle: OperationHandle
};

export type GetResultSetMetadataResponse = {
    status: Status,
    schema: TableSchema
};

export default class GetResultSetMetadataCommand {
    private client: ThriftClient;
    private TCLIService_types: TCLIServiceTypes;
    
    constructor(client: ThriftClient, TCLIService_types: TCLIServiceTypes) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }

    execute(getResultSetMetadataRequest: GetResultSetMetadataRequest): Promise<GetResultSetMetadataResponse> {
        return new Promise((resolve, reject) => {
            const request = new this.TCLIService_types.TGetResultSetMetadataReq(getResultSetMetadataRequest);
    
            this.client.GetResultSetMetadata(request, (err: Error, session: GetResultSetMetadataResponse) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });
    }
}
