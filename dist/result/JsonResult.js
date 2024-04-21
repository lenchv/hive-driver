"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../hive/Types");
class JsonResult {
    TCLIService_types;
    schema;
    data;
    constructor(TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
        this.schema = null;
        this.data = null;
    }
    setOperation(operation) {
        this.schema = operation.getSchema();
        this.data = operation.getData();
    }
    getValue() {
        if (!this.data) {
            return [];
        }
        const descriptors = this.getSchemaColumns();
        return this.data.reduce((result, rowSet) => {
            const columns = rowSet.columns || [];
            const rows = this.getRows(columns, descriptors);
            return result.concat(rows);
        }, []);
    }
    getSchemaColumns() {
        if (!this.schema) {
            return [];
        }
        return [...(this.schema.columns)]
            .sort((c1, c2) => c1.position - c2.position);
    }
    getRows(columns, descriptors) {
        const columnStartPosition = Math.max(Math.min(...descriptors.map(d => d.position)), 0);
        return descriptors.reduce((rows, descriptor) => {
            return this.getSchemaValues(descriptor, columns[descriptor.position - columnStartPosition] || {}).reduce((result, value, i) => {
                if (!result[i]) {
                    result[i] = {};
                }
                const name = this.getColumnName(descriptor);
                result[i][name] = value;
                return result;
            }, rows);
        }, []);
    }
    getSchemaValues(descriptor, column) {
        const typeDescriptor = descriptor.typeDesc.types[0]?.primitiveEntry || {};
        const columnValue = this.getColumnValue(column);
        if (!columnValue) {
            return [];
        }
        return columnValue.values.map((value, i) => {
            if (columnValue.nulls && this.isNull(columnValue.nulls, i)) {
                return null;
            }
            else {
                return this.convertData(typeDescriptor, value);
            }
        });
    }
    getColumnName(column) {
        const name = column.columnName || '';
        return name.split('.').pop() || '';
    }
    convertData(typeDescriptor, value) {
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
    }
    isNull(nulls, i) {
        const byte = nulls[Math.floor(i / 8)];
        const ofs = Math.pow(2, i % 8);
        return (byte & ofs) !== 0;
    }
    toJSON(value, defaultValue) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return defaultValue;
        }
    }
    convertBigInt(value) {
        return value.toNumber();
    }
    getColumnValue(column) {
        return column[Types_1.ColumnCode.binaryVal]
            || column[Types_1.ColumnCode.boolVal]
            || column[Types_1.ColumnCode.byteVal]
            || column[Types_1.ColumnCode.doubleVal]
            || column[Types_1.ColumnCode.i16Val]
            || column[Types_1.ColumnCode.i32Val]
            || column[Types_1.ColumnCode.i64Val]
            || column[Types_1.ColumnCode.stringVal];
    }
}
exports.default = JsonResult;
//# sourceMappingURL=JsonResult.js.map