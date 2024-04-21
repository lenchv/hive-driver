"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HiveDriverError_1 = __importDefault(require("../../errors/HiveDriverError"));
class BaseCommand {
    client;
    TCLIService_types;
    constructor(client, TCLIService_types) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }
    executeCommand(request, command) {
        return new Promise((resolve, reject) => {
            if (typeof command !== 'function') {
                return reject(new HiveDriverError_1.default('Hive driver: the operation does not exist, try to choose another Thrift file.'));
            }
            try {
                command.call(this.client, request, (err, response) => {
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
    }
}
exports.default = BaseCommand;
//# sourceMappingURL=BaseCommand.js.map