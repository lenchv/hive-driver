"use strict";
exports.__esModule = true;
var CloseSessionCommand = /** @class */ (function () {
    function CloseSessionCommand(client, TCLIService_types) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    CloseSessionCommand.prototype.execute = function (openSessionRequest) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new _this.TCLIService_types.TCloseSessionReq(openSessionRequest);
            _this.client.CloseSession(request, function (err, session) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(session);
                }
            });
        });
    };
    return CloseSessionCommand;
}());
exports["default"] = CloseSessionCommand;
