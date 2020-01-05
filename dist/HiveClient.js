"use strict";
exports.__esModule = true;
var HiveClient = /** @class */ (function () {
    function HiveClient(authProvider) {
        this.authProvider = authProvider;
    }
    HiveClient.prototype.connect = function (options) {
        var host = options.host;
        var port = options.port;
        return this;
    };
    return HiveClient;
}());
exports["default"] = HiveClient;
