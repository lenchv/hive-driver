"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../hive/Types");
var JsonResult = /** @class */ (function () {
    function JsonResult(TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
        this.schema = null;
        this.data = null;
    }
    JsonResult.prototype.setSchema = function (schema) {
        this.schema = schema;
    };
    JsonResult.prototype.setData = function (data) {
        this.data = data;
    };
    JsonResult.prototype.getValue = function () {
        var _this = this;
        if (!this.data) {
            return [];
        }
        var descriptors = this.getSchemaColumns();
        return this.data.reduce(function (result, rowSet) {
            var columns = rowSet.columns || [];
            var rows = _this.getRows(columns, descriptors);
            return result.concat(rows);
        }, []);
    };
    JsonResult.prototype.getSchemaColumns = function () {
        if (!this.schema) {
            return [];
        }
        return __spreadArrays((this.schema.columns)).sort(function (c1, c2) { return c1.position > c2.position ? 1 : c1.position < c2.position ? -1 : 0; });
    };
    JsonResult.prototype.getRows = function (columns, descriptors) {
        var _this = this;
        return descriptors.reduce(function (rows, descriptor) {
            return _this.getSchemaValues(descriptor, columns[descriptor.position - 1]).reduce(function (result, value, i) {
                if (!result[i]) {
                    result[i] = {};
                }
                var name = _this.getColumnName(descriptor);
                result[i][name] = value;
                return result;
            }, rows);
        }, []);
    };
    JsonResult.prototype.getSchemaValues = function (descriptor, column) {
        var _this = this;
        var _a;
        var typeDescriptor = ((_a = descriptor.typeDesc.types[0]) === null || _a === void 0 ? void 0 : _a.primitiveEntry) || {};
        return this.eachValue(typeDescriptor, column, function (value) {
            return _this.convertData(typeDescriptor, value);
        });
    };
    JsonResult.prototype.getColumnName = function (column) {
        var name = column.columnName || '';
        return name.split('.').pop() || '';
    };
    JsonResult.prototype.map = function (arr, callback) {
        return arr.map(function (value, i) {
            return callback(value, i);
        });
    };
    JsonResult.prototype.eachValue = function (typeDescriptor, column, callback) {
        switch (typeDescriptor.type) {
            case this.TCLIService_types.TTypeId.BOOLEAN_TYPE:
                return this.map(column[Types_1.ColumnCode.boolVal].values, callback);
            case this.TCLIService_types.TTypeId.TINYINT_TYPE:
                return this.map(column[Types_1.ColumnCode.byteVal].values, callback);
            case this.TCLIService_types.TTypeId.SMALLINT_TYPE:
                return this.map(column[Types_1.ColumnCode.i16Val].values, callback);
            case this.TCLIService_types.TTypeId.INT_TYPE:
                return this.map(column[Types_1.ColumnCode.i32Val].values, callback);
            case this.TCLIService_types.TTypeId.BIGINT_TYPE:
            case this.TCLIService_types.TTypeId.TIMESTAMP_TYPE:
                return this.map(column[Types_1.ColumnCode.i64Val].values, callback);
            case this.TCLIService_types.TTypeId.FLOAT_TYPE:
            case this.TCLIService_types.TTypeId.DOUBLE_TYPE:
                return this.map(column[Types_1.ColumnCode.doubleVal].values, callback);
            case this.TCLIService_types.TTypeId.BINARY_TYPE:
                return this.map(column[Types_1.ColumnCode.binaryVal].values, callback);
            default:
                return this.map(column[Types_1.ColumnCode.stringVal].values, callback);
        }
    };
    JsonResult.prototype.convertData = function (typeDescriptor, value) {
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
    JsonResult.prototype.toJSON = function (value, defaultValue) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return defaultValue;
        }
    };
    JsonResult.prototype.convertBigInt = function (value) {
        return value.toNumber();
    };
    return JsonResult;
}());
exports.default = JsonResult;
//# sourceMappingURL=JsonResult.js.map