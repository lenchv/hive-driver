"use strict";
exports.__esModule = true;
var GetResultSetMetadataCommand = /** @class */ (function () {
    function GetResultSetMetadataCommand(client, TCLIService_types) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    GetResultSetMetadataCommand.prototype.execute = function (getResultSetMetadataRequest) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new _this.TCLIService_types.TGetResultSetMetadataReq(getResultSetMetadataRequest);
            _this.client.GetResultSetMetadata(request, function (err, session) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(session);
                }
            });
        });
    };
    return GetResultSetMetadataCommand;
}());
exports["default"] = GetResultSetMetadataCommand;
