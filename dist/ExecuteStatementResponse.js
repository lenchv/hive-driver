"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExecuteStatementResponse = /** @class */ (function () {
    function ExecuteStatementResponse(response, thriftService) {
        this.response = response;
        this.thriftService = thriftService;
        this.data = [];
        this.schema = null;
    }
    ExecuteStatementResponse.prototype.create = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () { return _this.fetchData(); })
            .then(function () { return _this.fetchSchema(); })
            .then(function () { return _this.combine(); });
    };
    ExecuteStatementResponse.prototype.combine = function () {
        return {
            data: this.data,
            schema: this.schema || {
                status: {}
            },
        };
    };
    ExecuteStatementResponse.prototype.fetchData = function () {
        var _this = this;
        return this.thriftService.fetchResult(this.response)
            .then(function (data) {
            _this.data = data;
            return data;
        });
    };
    ExecuteStatementResponse.prototype.fetchSchema = function () {
        var _this = this;
        return this.thriftService.getResultSetMetadata(this.response)
            .then(function (schema) {
            _this.schema = schema;
            return schema;
        });
    };
    return ExecuteStatementResponse;
}());
exports.default = ExecuteStatementResponse;
//# sourceMappingURL=ExecuteStatementResponse.js.map