"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCommand_1 = __importDefault(require("./BaseCommand"));
var ExecuteStatementCommand = /** @class */ (function (_super) {
    __extends(ExecuteStatementCommand, _super);
    function ExecuteStatementCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExecuteStatementCommand.prototype.execute = function (executeStatementRequest) {
        var request = new this.TCLIService_types.TExecuteStatementReq(executeStatementRequest);
        return this.executeCommand(request, this.client.ExecuteStatement);
    };
    return ExecuteStatementCommand;
}(BaseCommand_1.default));
exports.default = ExecuteStatementCommand;
//# sourceMappingURL=ExecuteStatementCommand.js.map