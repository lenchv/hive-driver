"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HiveDriverError_1 = __importDefault(require("../../errors/HiveDriverError"));
var BaseCommand = /** @class */ (function () {
    function BaseCommand(client, TCLIService_types) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    BaseCommand.prototype.executeCommand = function (request, command) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof command !== 'function') {
                return reject(new HiveDriverError_1.default('Hive driver: the operation does not exist, try to choose another Thrift file.'));
            }
            try {
                command.call(_this.client, request, function (err, response) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    };
    return BaseCommand;
}());
exports.default = BaseCommand;
//# sourceMappingURL=BaseCommand.js.map