import IConnection from "../connection/IConnection";
import { ThriftClient, TCLIServiceTypes } from './Types/'
import OpenSessionCommand, { OpenSessionRequest, OpenSessionResponse } from "./Commands/OpenSessionCommand";
import CloseSessionCommand, { CloseSessionRequest, CloseSessionResponse } from "./Commands/CloseSessionCommand";
import ExecuteStatementCommand, { ExecuteStatementResponse, ExecuteStatementRequest } from "./Commands/ExecuteStatementCommand";
import GetResultSetMetadataCommand, { GetResultSetMetadataRequest, GetResultSetMetadataResponse } from "./Commands/GetResultSetMetadataCommand";
import FetchResultsCommand, { FetchResultsRequest, FetchResultsResponse } from "./Commands/FetchResultsCommand";
import GetInfoCommand, { GetInfoRequest, GetInfoResponse } from "./Commands/GetInfoCommand";
import GetTypeInfoCommand, { GetTypeInfoRequest, GetTypeInfoResponse } from "./Commands/GetTypeInfoCommand";
import GetCatalogsCommand, { GetCatalogsRequest, GetCatalogsResponse } from "./Commands/GetCatalogsCommand";
import GetSchemasCommand, { GetSchemasRequest, GetSchemasResponse } from "./Commands/GetSchemasCommand";

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

    getInfo(request: GetInfoRequest): Promise<GetInfoResponse> {
        const command = new GetInfoCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getTypeInfo(request: GetTypeInfoRequest): Promise<GetTypeInfoResponse> {
        const command = new GetTypeInfoCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getCatalogs(request: GetCatalogsRequest): Promise<GetCatalogsResponse> {
        const command = new GetCatalogsCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getSchemas(request: GetSchemasRequest): Promise<GetSchemasResponse> {
        const command = new GetSchemasCommand(
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