"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FetchResult = /** @class */ (function () {
    function FetchResult(TCLIService_types, client, response, limit) {
        if (limit === void 0) { limit = 100; }
        this.TCLIService_types = TCLIService_types;
        this.client = client;
        this.response = response;
        this.limit = limit;
    }
    FetchResult.prototype.execute = function () {
        if (!this.response.operationHandle.hasResultSet) {
            return Promise.resolve([]);
        }
        return this.first()
            .then(this.getResult.bind(this));
    };
    FetchResult.prototype.getResult = function (res) {
        if (!res.hasMoreRows) {
            return Promise.resolve([res]);
        }
        return this.next()
            .then(this.getResult.bind(this))
            .then(function (prevResult) {
            return __spreadArrays([
                res
            ], prevResult);
        });
    };
    FetchResult.prototype.first = function () {
        return this.fetchResults({
            orientation: this.TCLIService_types.TFetchOrientation.FETCH_FIRST,
            operationHandle: this.response.operationHandle,
            maxRows: this.limit,
        });
    };
    FetchResult.prototype.next = function () {
        return this.fetchResults({
            orientation: this.TCLIService_types.TFetchOrientation.FETCH_NEXT,
            operationHandle: this.response.operationHandle,
            maxRows: this.limit,
        });
    };
    FetchResult.prototype.fetchResults = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new _this.TCLIService_types.TFetchResultsReq(options);
            _this.client.FetchResults(request, function (err, res) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    };
    return FetchResult;
}());
exports.default = FetchResult;
//# sourceMappingURL=FetchResult.js.map