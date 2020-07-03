import { TCLIServiceTypes, RowSet, TableSchema, ColumnDesc, Column, PrimitiveTypeEntry, ColumnCode, ColumnType, TBoolColumn, TByteColumn, ThriftBuffer } from "../hive/Types";
import IOperationResult from "./IOperationResult";
import IOperation from "../contracts/IOperation";

export default class JsonResult implements IOperationResult {
    private TCLIService_types: TCLIServiceTypes;
    private schema: TableSchema | null;
    private data: Array<RowSet> | null;

    constructor(TCLIService_types: TCLIServiceTypes) {
        this.TCLIService_types = TCLIService_types;
        this.schema = null;
        this.data = null;
    }

    setOperation(operation: IOperation): void {
        this.schema = operation.getSchema();
        this.data = operation.getData();
    }

    getValue(): Array<object> {
        if (!this.data) {
            return [];
        }

        const descriptors = this.getSchemaColumns();

        return this.data.reduce((result: Array<any>, rowSet: RowSet) => {
            const columns = rowSet.columns || [];
            const rows = this.getRows(
                columns,
                descriptors
            );

            return result.concat(rows);
        }, []);   
    }

    private getSchemaColumns(): Array<ColumnDesc> {
        if (!this.schema) {
            return [];
        }

        return [...(this.schema.columns)]
            .sort((c1, c2) => c1.position - c2.position);
    }

    private getRows(columns: Array<Column>, descriptors: Array<ColumnDesc>): Array<any> {
        return descriptors.reduce((rows, descriptor) => {
            return this.getSchemaValues(
                descriptor,
                columns[descriptor.position - 1]
            ).reduce((result, value, i) => {
                if (!result[i]) {
                    result[i] = {};
                }

                const name = this.getColumnName(descriptor);

                result[i][name] = value;

                return result;
            }, rows);
        }, []);
    }

    private getSchemaValues(descriptor: ColumnDesc, column: Column): Array<any> {
        const typeDescriptor = descriptor.typeDesc.types[0]?.primitiveEntry || {};
        const columnValue = this.getColumnValue(column);

        if (!columnValue) {
            return [];
        }

        return columnValue.values.map((value: any, i: number) => {
            if (columnValue.nulls && this.isNull(columnValue.nulls, i)) {
                return null;
            } else {
                return this.convertData(typeDescriptor, value);
            }
        });
    }

    private getColumnName(column: ColumnDesc): string {
	    const name = column.columnName || '';

	    return name.split('.').pop() || '';
    }

    private convertData(typeDescriptor: PrimitiveTypeEntry, value: ColumnType): any {
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

    private isNull(nulls: Buffer, i: number): boolean {
        const byte = nulls[Math.floor(i / 8)];
        const ofs = Math.pow(2, i % 8);

        return (byte & ofs) !== 0;
    }

    private toJSON(value: any, defaultValue: any): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return defaultValue;
        }
    }

    private convertBigInt(value: any): any {
        return value.toNumber();
    }

    private getColumnValue(column: Column) {
        return column[ColumnCode.binaryVal]
            || column[ColumnCode.boolVal]
            || column[ColumnCode.byteVal]
            || column[ColumnCode.doubleVal]
            || column[ColumnCode.i16Val]
            || column[ColumnCode.i32Val]
            || column[ColumnCode.i64Val]
            || column[ColumnCode.stringVal];
    }
}