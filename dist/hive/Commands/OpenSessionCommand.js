"use strict";
exports.__esModule = true;
var OpenSessionCommand = /** @class */ (function () {
    function OpenSessionCommand(client, TCLIService_types) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    OpenSessionCommand.prototype.execute = function (openSessionRequest) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new _this.TCLIService_types.TOpenSessionReq(openSessionRequest);
            _this.client.OpenSession(request, function (err, session) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(session);
                }
            });
        });
    };
    return OpenSessionCommand;
}());
exports["default"] = OpenSessionCommand;
