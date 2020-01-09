"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Big = require('big.js');
var ResponseCombiner = /** @class */ (function () {
    function ResponseCombiner(TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
    }
    ResponseCombiner.prototype.combine = function (response) {
        var _this = this;
        var schema = response.schema, data = response.data;
        var columns = this.getSchemaColumns(schema);
        return data.reduce(function (result, response) {
            var _a, _b;
            var values = ((_b = (_a = response) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.columns) || [];
            var rows = _this.getRows(values, columns);
            return result.concat(rows);
        }, []);
    };
    ResponseCombiner.prototype.getSchemaColumns = function (schema) {
        var _a;
        return __spreadArrays((((_a = schema.schema) === null || _a === void 0 ? void 0 : _a.columns) || [])).sort(function (c1, c2) { return c1.position > c2.position ? 1 : c1.position < c2.position ? -1 : 0; });
    };
    ResponseCombiner.prototype.getRows = function (values, columns) {
        var _this = this;
        return columns.reduce(function (rows, column) {
            return _this.getSchemaValues(column, values[column.position - 1]).reduce(function (result, value, i) {
                if (!result[i]) {
                    result[i] = {};
                }
                var name = _this.getColumnName(column);
                result[i][name] = value;
                return result;
            }, rows);
        }, []);
    };
    ResponseCombiner.prototype.getSchemaValues = function (column, value) {
        var _this = this;
        var _a, _b, _c;
        var typeDescriptor = (((_b = (_a = column) === null || _a === void 0 ? void 0 : _a.typeDesc) === null || _b === void 0 ? void 0 : _b.types) || [{}])[0].primitiveEntry || {};
        var valueType = this.getValueType(typeDescriptor);
        var values = ((_c = value[valueType]) === null || _c === void 0 ? void 0 : _c.values) || [];
        return values.map(function (value) { return _this.convertData(typeDescriptor, value); });
    };
    ResponseCombiner.prototype.getColumnName = function (column) {
        var _a;
        var name = ((_a = column) === null || _a === void 0 ? void 0 : _a.columnName) || '';
        return name.split('.').pop();
    };
    ResponseCombiner.prototype.getValueType = function (typeDescriptor) {
        switch (typeDescriptor.type) {
            case this.TCLIService_types.TTypeId.BOOLEAN_TYPE:
                return 'boolVal';
            case this.TCLIService_types.TTypeId.TINYINT_TYPE:
                return 'byteVal';
            case this.TCLIService_types.TTypeId.SMALLINT_TYPE:
                return 'i16Val';
            case this.TCLIService_types.TTypeId.INT_TYPE:
                return 'i32Val';
            case this.TCLIService_types.TTypeId.BIGINT_TYPE:
            case this.TCLIService_types.TTypeId.TIMESTAMP_TYPE:
                return 'i64Val';
            case this.TCLIService_types.TTypeId.FLOAT_TYPE:
            case this.TCLIService_types.TTypeId.DOUBLE_TYPE:
                return 'doubleVal';
            case this.TCLIService_types.TTypeId.BINARY_TYPE:
                return 'binaryVal';
            default:
                return 'stringVal';
        }
    };
    ResponseCombiner.prototype.convertData = function (typeDescriptor, value) {
        switch (typeDescriptor.type) {
            case this.TCLIService_types.TTypeId.TIMESTAMP_TYPE:
            case this.TCLIService_types.TTypeId.DATE_TYPE:
            case this.TCLIService_types.TTypeId.UNION_TYPE:
            case this.TCLIService_types.TTypeId.USER_DEFINED_TYPE:
                return String(value);
            case this.TCLIService_types.TTypeId.DECIMAL_TYPE:
                return Number(value);
            case this.TCLIService_types.TTypeId.STRUCT_TYPE:
            case this.TCLIService_types.TTypeId.MAP_TYPE:
                return this.toJSON(value, {});
            case this.TCLIService_types.TTypeId.ARRAY_TYPE:
                return this.toJSON(value, []);
            case this.TCLIService_types.TTypeId.BIGINT_TYPE:
                return this.convertBigInt(value);
            case this.TCLIService_types.TTypeId.NULL_TYPE:
            case this.TCLIService_types.TTypeId.BINARY_TYPE:
            case this.TCLIService_types.TTypeId.INTERVAL_YEAR_MONTH_TYPE:
            case this.TCLIService_types.TTypeId.INTERVAL_DAY_TIME_TYPE:
            case this.TCLIService_types.TTypeId.FLOAT_TYPE:
            case this.TCLIService_types.TTypeId.DOUBLE_TYPE:
            case this.TCLIService_types.TTypeId.INT_TYPE:
            case this.TCLIService_types.TTypeId.SMALLINT_TYPE:
            case this.TCLIService_types.TTypeId.TINYINT_TYPE:
            case this.TCLIService_types.TTypeId.BOOLEAN_TYPE:
            case this.TCLIService_types.TTypeId.STRING_TYPE:
            case this.TCLIService_types.TTypeId.CHAR_TYPE:
            case this.TCLIService_types.TTypeId.VARCHAR_TYPE:
            default:
                return value;
        }
    };
    ResponseCombiner.prototype.toJSON = function (value, defaultValue) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return defaultValue;
        }
    };
    ResponseCombiner.prototype.convertBigInt = function (value) {
        var result = this.toInt64(value.buffer, value.offset);
        var max = new Big(Number.MAX_SAFE_INTEGER);
        if (result.cmp(max) > 0) {
            return Number.MAX_SAFE_INTEGER;
        }
        else {
            return parseInt(result.toString());
        }
    };
    ResponseCombiner.prototype.toInt64 = function (buffer, offset) {
        var b = buffer;
        var o = offset;
        var negate = b[o] & 0x80;
        var value = new Big(0);
        var m = new Big(1);
        var carry = 1;
        for (var i = 7; i >= 0; i -= 1) {
            var v = b[o + i];
            if (negate) {
                v = (v ^ 0xff) + carry;
                carry = v >> 8;
                v &= 0xff;
            }
            value = value.plus((new Big(v)).times(m));
            m = m.times(256);
        }
        if (negate) {
            value = value.times(-1);
        }
        return value;
    };
    ;
    return ResponseCombiner;
}());
exports.default = ResponseCombiner;
//# sourceMappingURL=ResponseCombiner.js.map