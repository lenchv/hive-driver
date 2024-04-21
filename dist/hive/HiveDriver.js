"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OpenSessionCommand_1 = __importDefault(require("./Commands/OpenSessionCommand"));
const CloseSessionCommand_1 = __importDefault(require("./Commands/CloseSessionCommand"));
const ExecuteStatementCommand_1 = __importDefault(require("./Commands/ExecuteStatementCommand"));
const GetResultSetMetadataCommand_1 = __importDefault(require("./Commands/GetResultSetMetadataCommand"));
const FetchResultsCommand_1 = __importDefault(require("./Commands/FetchResultsCommand"));
const GetInfoCommand_1 = __importDefault(require("./Commands/GetInfoCommand"));
const GetTypeInfoCommand_1 = __importDefault(require("./Commands/GetTypeInfoCommand"));
const GetCatalogsCommand_1 = __importDefault(require("./Commands/GetCatalogsCommand"));
const GetSchemasCommand_1 = __importDefault(require("./Commands/GetSchemasCommand"));
const GetTablesCommand_1 = __importDefault(require("./Commands/GetTablesCommand"));
const GetTableTypesCommand_1 = __importDefault(require("./Commands/GetTableTypesCommand"));
const GetColumnsCommand_1 = __importDefault(require("./Commands/GetColumnsCommand"));
const GetFunctionsCommand_1 = __importDefault(require("./Commands/GetFunctionsCommand"));
const GetPrimaryKeysCommand_1 = __importDefault(require("./Commands/GetPrimaryKeysCommand"));
const GetCrossReferenceCommand_1 = __importDefault(require("./Commands/GetCrossReferenceCommand"));
const GetOperationStatusCommand_1 = __importDefault(require("./Commands/GetOperationStatusCommand"));
const CancelOperationCommand_1 = __importDefault(require("./Commands/CancelOperationCommand"));
const CloseOperationCommand_1 = __importDefault(require("./Commands/CloseOperationCommand"));
const GetDelegationTokenCommand_1 = __importDefault(require("./Commands/GetDelegationTokenCommand"));
const CancelDelegationTokenCommand_1 = __importDefault(require("./Commands/CancelDelegationTokenCommand"));
const RenewDelegationTokenCommand_1 = __importDefault(require("./Commands/RenewDelegationTokenCommand"));
const GetQueryIdCommand_1 = __importDefault(require("./Commands/GetQueryIdCommand"));
const SetClientInfoCommand_1 = __importDefault(require("./Commands/SetClientInfoCommand"));
const UploadDataCommand_1 = __importDefault(require("./Commands/UploadDataCommand"));
const DownloadDataCommand_1 = __importDefault(require("./Commands/DownloadDataCommand"));
class HiveDriver {
    TCLIService_types;
    client;
    constructor(TCLIService_types, client) {
        this.TCLIService_types = TCLIService_types;
        this.client = client;
    }
    openSession(request) {
        const action = new OpenSessionCommand_1.default(this.client, this.TCLIService_types);
        return action.execute(request);
    }
    closeSession(request) {
        const command = new CloseSessionCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    executeStatement(request) {
        const command = new ExecuteStatementCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getResultSetMetadata(request) {
        const command = new GetResultSetMetadataCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    fetchResults(request) {
        const command = new FetchResultsCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getInfo(request) {
        const command = new GetInfoCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getTypeInfo(request) {
        const command = new GetTypeInfoCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getCatalogs(request) {
        const command = new GetCatalogsCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getSchemas(request) {
        const command = new GetSchemasCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getTables(request) {
        const command = new GetTablesCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getTableTypes(request) {
        const command = new GetTableTypesCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getColumns(request) {
        const command = new GetColumnsCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getFunctions(request) {
        const command = new GetFunctionsCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getPrimaryKeys(request) {
        const command = new GetPrimaryKeysCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getCrossReference(request) {
        const command = new GetCrossReferenceCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getOperationStatus(request) {
        const command = new GetOperationStatusCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    cancelOperation(request) {
        const command = new CancelOperationCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    closeOperation(request) {
        const command = new CloseOperationCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getDelegationToken(request) {
        const command = new GetDelegationTokenCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    cancelDelegationToken(request) {
        const command = new CancelDelegationTokenCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    renewDelegationToken(request) {
        const command = new RenewDelegationTokenCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    getQueryId(request) {
        const command = new GetQueryIdCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    setClientInfo(request) {
        const command = new SetClientInfoCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    uploadData(request) {
        const command = new UploadDataCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
    downloadData(request) {
        const command = new DownloadDataCommand_1.default(this.client, this.TCLIService_types);
        return command.execute(request);
    }
}
exports.default = HiveDriver;
//# sourceMappingURL=HiveDriver.js.map