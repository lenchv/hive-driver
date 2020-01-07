"use strict";
exports.__esModule = true;
var BaseCommand = /** @class */ (function () {
    function BaseCommand(client, TCLIService_types) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    BaseCommand.prototype.executeCommand = function (request, command) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            command.call(_this.client, request, function (err, response) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    };
    return BaseCommand;
}());
exports["default"] = BaseCommand;