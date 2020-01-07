import { ThriftClient, TCLIServiceTypes, SessionHandle, Status } from "../Types";

export type CloseSessionRequest = {
    sessionHandle: SessionHandle
};

export type CloseSessionResponse = {
    status: Status
};

export default class CloseSessionCommand {
    private client: ThriftClient;
    private TCLIService_types: TCLIServiceTypes;
    
    constructor(client: ThriftClient, TCLIService_types: TCLIServiceTypes) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    
    execute(openSessionRequest: CloseSessionRequest): Promise<CloseSessionResponse> {
        return new Promise((resolve, reject) => {
            const request = new this.TCLIService_types.TCloseSessionReq(openSessionRequest);
    
            this.client.CloseSession(request, (err: Error, session: CloseSessionResponse) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });
    }
}
