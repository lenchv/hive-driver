"use strict";
exports.__esModule = true;
var ExecuteStatementCommand = /** @class */ (function () {
    function ExecuteStatementCommand(client, TCLIService_types) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    ExecuteStatementCommand.prototype.execute = function (executeStatementRequest) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new _this.TCLIService_types.TExecuteStatementReq(executeStatementRequest);
            _this.client.ExecuteStatement(request, function (err, session) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(session);
                }
            });
        });
    };
    return ExecuteStatementCommand;
}());
exports["default"] = ExecuteStatementCommand;
