"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../hive/Types");
var JsonResult = /** @class */ (function () {
    function JsonResult(TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
        this.schema = null;
        this.data = null;
    }
    JsonResult.prototype.setOperation = function (operation) {
        this.schema = operation.getSchema();
        this.data = operation.getData();
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
        return __spreadArray([], (this.schema.columns), true).sort(function (c1, c2) { return c1.position - c2.position; });
    };
    JsonResult.prototype.getRows = function (columns, descriptors) {
        var _this = this;
        var columnStartPosition = Math.min.apply(Math, descriptors.map(function (d) { return d.position; }));
        return descriptors.reduce(function (rows, descriptor) {
            return _this.getSchemaValues(descriptor, columns[descriptor.position - columnStartPosition]).reduce(function (result, value, i) {
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
        var columnValue = this.getColumnValue(column);
        if (!columnValue) {
            return [];
        }
        return columnValue.values.map(function (value, i) {
            if (columnValue.nulls && _this.isNull(columnValue.nulls, i)) {
                return null;
            }
            else {
                return _this.convertData(typeDescriptor, value);
            }
        });
    };
    JsonResult.prototype.getColumnName = function (column) {
        var name = column.columnName || '';
        return name.split('.').pop() || '';
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
    JsonResult.prototype.isNull = function (nulls, i) {
        var byte = nulls[Math.floor(i / 8)];
        var ofs = Math.pow(2, i % 8);
        return (byte & ofs) !== 0;
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
    JsonResult.prototype.getColumnValue = function (column) {
        return column[Types_1.ColumnCode.binaryVal]
            || column[Types_1.ColumnCode.boolVal]
            || column[Types_1.ColumnCode.byteVal]
            || column[Types_1.ColumnCode.doubleVal]
            || column[Types_1.ColumnCode.i16Val]
            || column[Types_1.ColumnCode.i32Val]
            || column[Types_1.ColumnCode.i64Val]
            || column[Types_1.ColumnCode.stringVal];
    };
    return JsonResult;
}());
exports.default = JsonResult;
//# sourceMappingURL=JsonResult.js.map