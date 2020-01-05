"use strict";
exports.__esModule = true;
var HiveClient = /** @class */ (function () {
    /**
     *
     * @param TCLIService TCLIService generated from TCLIService.thrift
     * @param TCLIService_types TCLIService_types generated from TCLIService.thrift
     * @param connectionProvider
     */
    function HiveClient(TCLIService, TCLIService_types, connectionProvider) {
        this.connectionProvider = connectionProvider;
        this.thriftCliService = TCLIService;
        this.thriftTypes = TCLIService_types;
        this.connection = null;
    }
    HiveClient.prototype.connect = function (options) {
        var _this = this;
        return this.connectionProvider
            .connect(options)
            .then(function (connection) {
            _this.connection = connection;
            return _this;
        });
    };
    return HiveClient;
}());
exports["default"] = HiveClient;
