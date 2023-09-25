"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var CloseSessionCommand = /** @class */ (function (_super) {
    __extends(CloseSessionCommand, _super);
    function CloseSessionCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CloseSessionCommand.prototype.execute = function (openSessionRequest) {
        var request = new this.TCLIService_types.TCloseSessionReq(openSessionRequest);
        return this.executeCommand(request, this.client.CloseSession);
    };
    return CloseSessionCommand;
}(BaseCommand_1.default));
exports.default = CloseSessionCommand;
//# sourceMappingURL=CloseSessionCommand.js.map