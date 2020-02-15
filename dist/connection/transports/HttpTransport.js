"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpTransport = /** @class */ (function () {
    function HttpTransport(httpOptions) {
        if (httpOptions === void 0) { httpOptions = {}; }
        this.httpOptions = httpOptions;
    }
    HttpTransport.prototype.getTransport = function () {
        return this.httpOptions;
    };
    HttpTransport.prototype.setOptions = function (option, value) {
        var _a;
        this.httpOptions = __assign(__assign({}, this.httpOptions), (_a = {}, _a[option] = value, _a));
    };
    HttpTransport.prototype.getOptions = function () {
        return this.httpOptions;
    };
    HttpTransport.prototype.connect = function () { };
    ;
    HttpTransport.prototype.addListener = function () { };
    HttpTransport.prototype.removeListener = function () { };
    HttpTransport.prototype.write = function () { };
    HttpTransport.prototype.end = function () { };
    HttpTransport.prototype.emit = function () { };
    return HttpTransport;
}());
exports.default = HttpTransport;
//# sourceMappingURL=HttpTransport.js.map