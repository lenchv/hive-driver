import IConnection from "../connection/IConnection";
import FetchResult from "./Commands/FetchResult";
import { ThriftClient } from "./Types/";

const thrift = require('thrift');

export type TCLIServiceTypes = {
    TOpenSessionReq: any,
    TProtocolVersion: any,
    TExecuteStatementReq: any,
    TFetchResultsReq: any,
    TFetchOrientation: any,
    TGetResultSetMetadataReq: any,
    TTypeId: any,
    TStatusCode: any,
};

/**
 * For auth mechanism GSSAPI the host and service should be provided when session is opened.
 */
type SessionConfiguration = {
    krb_host?: string,
    krb_service?: string
};

type OpenSessionParameters = {
    configuration?: SessionConfiguration,
    username?: string,
    password?: string
};

export type ThriftSession = {
    sessionHandle: any
};

export type ThriftResponse = {
    status: any,
    operationHandle: any
};

export type ExecuteStatementRequest = {
    confOverlay?: Map<string, string>,
    runAsync?: boolean,
    queryTimeout?: number
};

export type ResultSetMetadataResponse = {
    status: any,
    schema?: any
};

export default class ThriftService {
    private TCLIService: object;
    private TCLIService_types: TCLIServiceTypes;
    private protocol: any;
    private client: ThriftClient | null;

    constructor(TCLIService: object, TCLIService_types: TCLIServiceTypes, protocol?: number) {
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this.protocol = protocol || this.getTheLatestProtocol();
        this.client = null;
    }

    createClient(connection: IConnection): ThriftClient | null {
        this.client = thrift.createClient(this.TCLIService, connection.getConnection());

        return this.client;
    }

    openSession(parameters: OpenSessionParameters): Promise<ThriftSession> {
        return new Promise((resolve, reject) => {
            const request = new this.TCLIService_types.TOpenSessionReq(this.setIfDefined({
                client_protocol: this.protocol,
                ...parameters,
            }));

            this.getClient().OpenSession(request, (err: Error, session: ThriftSession) => {
				if (err) {
                    reject(err);
				} else {
                    resolve(session);
				}
			});
        });
    }

    executeStatement(session: ThriftSession, statement: string, options: ExecuteStatementRequest): Promise<ThriftResponse> {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                sessionHandle: session.sessionHandle,
                statement: statement,
                confOverlay: undefined,
                runAsync: false,
                queryTimeout: 100000,
                ...options
            };
            const request = new this.TCLIService_types.TExecuteStatementReq(requestOptions);

            this.getClient().ExecuteStatement(request, (err: Error, res: ThriftResponse) => {
                if (err) {
                    reject(err);
                } else if (res.status.statusCode === this.TCLIService_types.TStatusCode.ERROR_STATUS) {
                    reject(new Error(res.status.errorMessage));
                } else {
                    resolve(res);
                }
            });
        });
    }

    fetchResult(response: ThriftResponse, limit?: number): Promise<Array<any>> {
        const result = new FetchResult(
            this.TCLIService_types,
            this.getClient(),
            response,
            limit
        );

        return result.execute();
    }

    getResultSetMetadata(response: ThriftResponse): Promise<ResultSetMetadataResponse> {
        if (!response.operationHandle) {
			return Promise.reject(new Error('operation handle does not exist'));
		}
	
		return new Promise((resolve, reject) => {
            const request = new this.TCLIService_types.TGetResultSetMetadataReq(response);

            this.getClient().GetResultSetMetadata(request, (error: Error, result: ResultSetMetadataResponse) => {
                error ? reject(error) : resolve(result);
            });
        });
    }

    getClient(): ThriftClient {
        if (!this.client) {
            throw new Error('ThriftService: client is not initialized');
        }

        return this.client;
    }

    private getTheLatestProtocol(): number {
        return Number(Object.values(this.TCLIService_types.TProtocolVersion).pop());
    }

    private setIfDefined(parameters: {
        [key: string]: any
    }): object {
        return Object.keys(parameters).reduce((result: object, key: string): object=> {
            if (parameters[key] === undefined) {
                return result;
            } else {
                return {
                    ...result,
                    [key]: parameters[key]
                };
            }
        }, {});
    }
}