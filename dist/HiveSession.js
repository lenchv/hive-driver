"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HiveOperation_1 = __importDefault(require("./HiveOperation"));
const StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
const InfoValue_1 = __importDefault(require("./dto/InfoValue"));
class HiveSession {
    driver;
    sessionHandle;
    TCLIService_types;
    statusFactory;
    constructor(driver, sessionHandle, TCLIService_types) {
        this.driver = driver;
        this.sessionHandle = sessionHandle;
        this.TCLIService_types = TCLIService_types;
        this.statusFactory = new StatusFactory_1.default(TCLIService_types);
    }
    getInfo(infoType) {
        return this.driver.getInfo({
            sessionHandle: this.sessionHandle,
            infoType
        }).then(response => {
            this.assertStatus(response.status);
            return new InfoValue_1.default(response.infoValue);
        });
    }
    executeStatement(statement, options = {}) {
        options = {
            runAsync: false,
            ...options
        };
        return this.driver.executeStatement({
            sessionHandle: this.sessionHandle,
            statement,
            ...options
        }).then((response) => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getTypeInfo() {
        return this.driver.getTypeInfo({
            sessionHandle: this.sessionHandle
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getCatalogs() {
        return this.driver.getCatalogs({
            sessionHandle: this.sessionHandle
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getSchemas(request) {
        return this.driver.getSchemas({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getTables(request) {
        return this.driver.getTables({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
            tableName: request.tableName,
            tableTypes: request.tableTypes,
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getTableTypes() {
        return this.driver.getTableTypes({
            sessionHandle: this.sessionHandle,
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getColumns(request) {
        return this.driver.getColumns({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
            tableName: request.tableName,
            columnName: request.columnName,
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getFunctions(request) {
        return this.driver.getFunctions({
            sessionHandle: this.sessionHandle,
            functionName: request.functionName,
            schemaName: request.schemaName,
            catalogName: request.catalogName,
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getPrimaryKeys(request) {
        return this.driver.getPrimaryKeys({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
            tableName: request.tableName,
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getCrossReference(request) {
        return this.driver.getCrossReference({
            sessionHandle: this.sessionHandle,
            parentCatalogName: request.parentCatalogName,
            parentSchemaName: request.parentSchemaName,
            parentTableName: request.parentTableName,
            foreignCatalogName: request.foreignCatalogName,
            foreignSchemaName: request.foreignSchemaName,
            foreignTableName: request.foreignTableName,
        }).then(response => {
            this.assertStatus(response.status);
            return this.createOperation(response.operationHandle);
        });
    }
    getDelegationToken(owner, renewer) {
        return this.driver.getDelegationToken({
            sessionHandle: this.sessionHandle,
            owner,
            renewer
        }).then(response => {
            this.assertStatus(response.status);
            return response.delegationToken || '';
        });
    }
    renewDelegationToken(token) {
        return this.driver.renewDelegationToken({
            sessionHandle: this.sessionHandle,
            delegationToken: token
        }).then(response => {
            this.assertStatus(response.status);
            return this.statusFactory.create(response.status);
        });
    }
    cancelDelegationToken(token) {
        return this.driver.cancelDelegationToken({
            sessionHandle: this.sessionHandle,
            delegationToken: token
        }).then(response => {
            this.assertStatus(response.status);
            return this.statusFactory.create(response.status);
        });
    }
    close() {
        return this.driver.closeSession({
            sessionHandle: this.sessionHandle
        }).then((response) => {
            return this.statusFactory.create(response.status);
        });
    }
    createOperation(handle) {
        return new HiveOperation_1.default(this.driver, handle, this.TCLIService_types);
    }
    assertStatus(responseStatus) {
        this.statusFactory.create(responseStatus);
    }
}
exports.default = HiveSession;
//# sourceMappingURL=HiveSession.js.map