"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var OperationStateError_1 = __importDefault(require("../errors/OperationStateError"));
var WaitUntilReady = /** @class */ (function () {
    function WaitUntilReady(operation, TCLIService_types) {
        this.operation = operation;
        this.TCLIService_types = TCLIService_types;
    }
    /**
     * Executes until operation has status finished or has one of the invalid states
     *
     * @param progress flag for operation status command. If it sets true, response will include progressUpdateResponse with progress information
     * @param callback if callback specified it will be called each time the operation status response received and it will be passed as first parameter
     */
    WaitUntilReady.prototype.execute = function (progress, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var response, isReady;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.operation.status(Boolean(progress))];
                    case 1:
                        response = _a.sent();
                        if (!(typeof callback === 'function')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.executeCallback(callback.bind(null, response))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        try {
                            isReady = this.isReady(response);
                            if (isReady) {
                                return [2 /*return*/, this.operation];
                            }
                            else {
                                return [2 /*return*/, this.execute(progress, callback)];
                            }
                        }
                        catch (error) {
                            throw error;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WaitUntilReady.prototype.isReady = function (response) {
        switch (response.operationState) {
            case this.TCLIService_types.TOperationState.INITIALIZED_STATE:
                return false;
            case this.TCLIService_types.TOperationState.RUNNING_STATE:
                return false;
            case this.TCLIService_types.TOperationState.FINISHED_STATE:
                return true;
            case this.TCLIService_types.TOperationState.CANCELED_STATE:
                throw new OperationStateError_1.default('The operation was canceled by a client', response);
            case this.TCLIService_types.TOperationState.CLOSED_STATE:
                throw new OperationStateError_1.default('The operation was closed by a client', response);
            case this.TCLIService_types.TOperationState.ERROR_STATE:
                throw new OperationStateError_1.default('The operation failed due to an error', response);
            case this.TCLIService_types.TOperationState.PENDING_STATE:
                throw new OperationStateError_1.default('The operation is in a pending state', response);
            case this.TCLIService_types.TOperationState.TIMEDOUT_STATE:
                throw new OperationStateError_1.default('The operation is in a timedout state', response);
            case this.TCLIService_types.TOperationState.UKNOWN_STATE:
            default:
                throw new OperationStateError_1.default('The operation is in an unrecognized state', response);
        }
    };
    WaitUntilReady.prototype.executeCallback = function (callback) {
        var result = callback();
        if (result instanceof Promise) {
            return result;
        }
        else {
            return Promise.resolve(result);
        }
    };
    return WaitUntilReady;
}());
exports.default = WaitUntilReady;
//# sourceMappingURL=WaitUntilReady.js.map