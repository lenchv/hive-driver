import { ThriftClient, TCLIServiceTypes, ThriftSession, Status, SessionHandle } from "../Types";

/**
 * For auth mechanism GSSAPI the host and service should be provided when session is opened.
 */
type SessionConfiguration = {
    krb_host?: string,
    krb_service?: string,
    [key: string]: any,
};

/**
 * @param client_protocol  One of the values TCLIService_types.TProtocolVersion. May be different depends on version of Hive you use.
 *                         For instance, for Hive lower that 3.x it is better to use HIVE_CLI_SERVICE_PROTOCOL_V8.
 * @param username         if authorization is used you should define username and password
 * @param password
 * @param configuration    in case of GSSAPI you should define configuration
 */
export type OpenSessionRequest = {
    client_protocol: number,
    username?: string,
    password?: string,
    configuration?: SessionConfiguration,
};

export type OpenSessionResponse = {
    status: Status,
    serverProtocolVersion: number,
    sessionHandle?: SessionHandle, 
    configuration?: SessionConfiguration,
};

export default class OpenSessionCommand {
    private client: ThriftClient;
    private TCLIService_types: TCLIServiceTypes;
    
    constructor(client: ThriftClient, TCLIService_types: TCLIServiceTypes) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    
    execute(openSessionRequest: OpenSessionRequest): Promise<OpenSessionResponse> {
        return new Promise((resolve, reject) => {
            const request = new this.TCLIService_types.TOpenSessionReq(openSessionRequest);
    
            this.client.OpenSession(request, (err: Error, session: OpenSessionResponse) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });
    }
}
