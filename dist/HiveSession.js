"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Operation_1 = __importDefault(require("./Operation"));
var HiveSession = /** @class */ (function () {
    function HiveSession(driver, sessionHandle) {
        this.driver = driver;
        this.sessionHandle = sessionHandle;
    }
    HiveSession.prototype.getInfo = function (infoType) {
        return this.driver.getInfo({
            sessionHandle: this.sessionHandle,
            infoType: infoType
        });
    };
    HiveSession.prototype.executeStatement = function (statement) {
        var _this = this;
        return this.driver.executeStatement({
            sessionHandle: this.sessionHandle,
            runAsync: false,
            statement: statement,
        }).then(function (response) {
            var operation = new Operation_1.default(_this.driver, response.operationHandle);
            return operation;
        });
    };
    return HiveSession;
}());
exports.default = HiveSession;
//# sourceMappingURL=HiveSession.js.map