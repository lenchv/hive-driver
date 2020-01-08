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
import GetTablesCommand, { GetTablesRequest, GetTablesResponse } from "./Commands/GetTablesCommand";
import GetTableTypesCommand, { GetTableTypesRequest, GetTableTypesResponse } from "./Commands/GetTableTypesCommand";
import GetColumnsCommand, { GetColumnsRequest, GetColumnsResponse } from "./Commands/GetColumnsCommand";
import GetFunctionsCommand, { GetFunctionsRequest, GetFunctionsResponse } from "./Commands/GetFunctionsCommand";
import GetPrimaryKeysCommand, { GetPrimaryKeysRequest, GetPrimaryKeysResponse } from "./Commands/GetPrimaryKeysCommand";
import GetCrossReferenceCommand, { GetCrossReferenceRequest, GetCrossReferenceResponse } from "./Commands/GetCrossReferenceCommand";
import GetOperationStatusCommand, { GetOperationStatusRequest, GetOperationStatusResponse } from "./Commands/GetOperationStatusCommand";
import CancelOperationCommand, { CancelOperationRequest, CancelOperationResponse } from "./Commands/CancelOperationCommand";
import CloseOperationCommand, { CloseOperationRequest, CloseOperationResponse } from "./Commands/CloseOperationCommand";
import GetDelegationTokenCommand, { GetDelegationTokenRequest, GetDelegationTokenResponse } from "./Commands/GetDelegationTokenCommand";
import CancelDelegationTokenCommand, { CancelDelegationTokenRequest, CancelDelegationTokenResponse } from "./Commands/CancelDelegationTokenCommand";
import RenewDelegationTokenCommand, { RenewDelegationTokenRequest, RenewDelegationTokenResponse } from "./Commands/RenewDelegationTokenCommand";
import GetQueryIdCommand, { GetQueryIdRequest, GetQueryIdResponse } from "./Commands/GetQueryIdCommand";
import SetClientInfoCommand, { SetClientInfoRequest, SetClientInfoResponse } from "./Commands/SetClientInfoCommand";

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

    getTables(request: GetTablesRequest): Promise<GetTablesResponse> {
        const command = new GetTablesCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getTableTypes(request: GetTableTypesRequest): Promise<GetTableTypesResponse> {
        const command = new GetTableTypesCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getColumns(request: GetColumnsRequest): Promise<GetColumnsResponse> {
        const command = new GetColumnsCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getFunctions(request: GetFunctionsRequest): Promise<GetFunctionsResponse> {
        const command = new GetFunctionsCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getPrimaryKeys(request: GetPrimaryKeysRequest): Promise<GetPrimaryKeysResponse> {
        const command = new GetPrimaryKeysCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getCrossReference(request: GetCrossReferenceRequest): Promise<GetCrossReferenceResponse> {
        const command = new GetCrossReferenceCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getOperationStatus(request: GetOperationStatusRequest): Promise<GetOperationStatusResponse> {
        const command = new GetOperationStatusCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    cancelOperation(request: CancelOperationRequest): Promise<CancelOperationResponse> {
        const command = new CancelOperationCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    closeOperation(request: CloseOperationRequest): Promise<CloseOperationResponse> {
        const command = new CloseOperationCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getDelegationToken(request: GetDelegationTokenRequest): Promise<GetDelegationTokenResponse> {
        const command = new GetDelegationTokenCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    cancelDelegationToken(request: CancelDelegationTokenRequest): Promise<CancelDelegationTokenResponse> {
        const command = new CancelDelegationTokenCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    renewDelegationToken(request: RenewDelegationTokenRequest): Promise<RenewDelegationTokenResponse> {
        const command = new RenewDelegationTokenCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    getQueryId(request: GetQueryIdRequest): Promise<GetQueryIdResponse> {
        const command = new GetQueryIdCommand(
            this.getClient(),
            this.TCLIService_types
        );

        return command.execute(request);
    }

    setClientInfo(request: SetClientInfoRequest): Promise<SetClientInfoResponse> {
        const command = new SetClientInfoCommand(
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