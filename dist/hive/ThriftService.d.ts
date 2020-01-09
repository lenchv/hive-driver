import IConnection from "../connection/IConnection";
import { ThriftClient } from "./Types/";
export declare type TCLIServiceTypes = {
    TOpenSessionReq: any;
    TProtocolVersion: any;
    TExecuteStatementReq: any;
    TFetchResultsReq: any;
    TFetchOrientation: any;
    TGetResultSetMetadataReq: any;
    TTypeId: any;
    TStatusCode: any;
};
/**
 * For auth mechanism GSSAPI the host and service should be provided when session is opened.
 */
declare type SessionConfiguration = {
    krb_host?: string;
    krb_service?: string;
};
declare type OpenSessionParameters = {
    configuration?: SessionConfiguration;
    username?: string;
    password?: string;
};
export declare type ThriftSession = {
    sessionHandle: any;
};
export declare type ThriftResponse = {
    status: any;
    operationHandle: any;
};
export declare type ExecuteStatementRequest = {
    confOverlay?: Map<string, string>;
    runAsync?: boolean;
    queryTimeout?: number;
};
export declare type ResultSetMetadataResponse = {
    status: any;
    schema?: any;
};
export default class ThriftService {
    private TCLIService;
    private TCLIService_types;
    private protocol;
    private client;
    constructor(TCLIService: object, TCLIService_types: TCLIServiceTypes, protocol?: number);
    createClient(connection: IConnection): ThriftClient | null;
    openSession(parameters: OpenSessionParameters): Promise<ThriftSession>;
    executeStatement(session: ThriftSession, statement: string, options: ExecuteStatementRequest): Promise<ThriftResponse>;
    fetchResult(response: ThriftResponse, limit?: number): Promise<Array<any>>;
    getResultSetMetadata(response: ThriftResponse): Promise<ResultSetMetadataResponse>;
    getClient(): ThriftClient;
    private getTheLatestProtocol;
    private setIfDefined;
}
export {};
