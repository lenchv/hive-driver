import { ThriftClient, TCLIServiceTypes, SessionHandle, Status, OperationHandle } from "../Types";

export type ExecuteStatementRequest = {
    sessionHandle: SessionHandle,
    statement: string,
    confOverlay: Map<string, string>,
    runAsync: boolean,
    queryTimeout: number
};

export type ExecuteStatementResponse = {
    status: Status,
    operationHandle: OperationHandle
};

export default class ExecuteStatementCommand {
    private client: ThriftClient;
    private TCLIService_types: TCLIServiceTypes;
    
    constructor(client: ThriftClient, TCLIService_types: TCLIServiceTypes) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }

    execute(executeStatementRequest: ExecuteStatementRequest): Promise<ExecuteStatementResponse> {
        return new Promise((resolve, reject) => {
            const request = new this.TCLIService_types.TExecuteStatementReq(executeStatementRequest);
    
            this.client.ExecuteStatement(request, (err: Error, session: ExecuteStatementResponse) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });
    }
}