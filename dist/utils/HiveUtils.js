"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WaitUntilReady_1 = __importDefault(require("./WaitUntilReady"));
const GetResult_1 = __importDefault(require("./GetResult"));
const ProgressUpdateTransformer_1 = __importDefault(require("./ProgressUpdateTransformer"));
class HiveUtils {
    TCLIService_types;
    constructor(TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
    }
    waitUntilReady(operation, progress, callback) {
        const waitUntilReady = new WaitUntilReady_1.default(operation, this.TCLIService_types);
        return waitUntilReady.execute(progress, callback);
    }
    getResult(operation, resultHandler) {
        const getResult = new GetResult_1.default(operation, this.TCLIService_types);
        return getResult.execute(resultHandler);
    }
    fetchAll(operation, orientation) {
        return operation.fetch(orientation)
            .then(() => {
            if (operation.hasMoreRows()) {
                return this.fetchAll(operation);
            }
            else {
                return operation;
            }
        });
    }
    formatProgress(progressUpdate) {
        return String(new ProgressUpdateTransformer_1.default(progressUpdate));
    }
}
exports.default = HiveUtils;
//# sourceMappingURL=HiveUtils.js.map