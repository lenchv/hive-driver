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
var GetColumnsCommand = /** @class */ (function (_super) {
    __extends(GetColumnsCommand, _super);
    function GetColumnsCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetColumnsCommand.prototype.execute = function (data) {
        var request = new this.TCLIService_types.TGetColumnsReq(data);
        return this.executeCommand(request, this.client.GetColumns);
    };
    return GetColumnsCommand;
}(BaseCommand_1.default));
exports.default = GetColumnsCommand;
//# sourceMappingURL=GetColumnsCommand.js.map