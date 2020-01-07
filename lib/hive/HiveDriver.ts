import IConnection from "../connection/IConnection";
import { ThriftClient, TCLIServiceTypes } from './Types/'
import OpenSessionCommand, { OpenSessionRequest, OpenSessionResponse } from "./Commands/OpenSessionCommand";
import CloseSessionCommand, { CloseSessionRequest, CloseSessionResponse } from "./Commands/CloseSessionCommand";
import ExecuteStatementCommand, { ExecuteStatementResponse, ExecuteStatementRequest } from "./Commands/ExecuteStatementCommand";
import GetResultSetMetadataCommand, { GetResultSetMetadataRequest, GetResultSetMetadataResponse } from "./Commands/GetResultSetMetadataCommand";
import FetchResultsCommand, { FetchResultsRequest, FetchResultsResponse } from "./Commands/FetchResultsCommand";

const thrift = require('thrift');

export default class HiveDriver {
    private TCLIService: object;
    private TCLIService_types: TCLIServiceTypes;
    private _client: ThriftClient | null;

    constructor(TCLIService: object, TCLIService_types: TCLIServiceTypes) {
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this._client = null;
    }

    createClient(connection: IConnection): HiveDriver {
        this._client = thrift.createClient(this.TCLIService, connection.getConnection());

        return this;
    }

    openSession(request: OpenSessionRequest): Promise<OpenSessionResponse> {
        const action = new OpenSessionCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return action.execute(request);
    }

    closeSession(request: CloseSessionRequest): Promise<CloseSessionResponse> {
        const command = new CloseSessionCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    executeStatement(request: ExecuteStatementRequest): Promise<ExecuteStatementResponse> {
        const command = new ExecuteStatementCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getResultSetMetadata(request: GetResultSetMetadataRequest): Promise<GetResultSetMetadataResponse> {
        const command = new GetResultSetMetadataCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    fetchResults(request: FetchResultsRequest): Promise<FetchResultsResponse> {
        const command = new FetchResultsCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getClient(): ThriftClient {
        if (!this._client) {
            throw new Error('HiveDriver: client is not initialized');
        }

        return this._client;
    }
}