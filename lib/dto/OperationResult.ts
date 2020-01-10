import { TCLIServiceTypes, RowSet, TableSchema, ColumnDesc, Column, PrimitiveTypeEntry, ColumnCode, ColumnType, TBoolColumn, TByteColumn, ThriftBuffer } from "../hive/Types";

export default class OperationResult {
    private TCLIService_types: TCLIServiceTypes;
    private schema: TableSchema;
    private data: Array<RowSet>;

    constructor(schema: TableSchema, data: Array<RowSet>, TCLIService_types: TCLIServiceTypes) {
        this.TCLIService_types = TCLIService_types;
        this.schema = schema;
        this.data = data;
    }

    getValue(): Array<object> {
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
        return [...(this.schema.columns)]
            .sort((c1, c2) => c1.position > c2.position ? 1 : c1.position < c2.position ? -1 : 0);
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
        const typeDescriptor = descriptor.typeDesc.types[0]?.primitiveEntry || {};//(column?.typeDesc?.types || [{}])[0].primitiveEntry || {};

        return this.eachValue(typeDescriptor, column, (value: any) => {
            return this.convertData(typeDescriptor, value);
        });
    }

    private getColumnName(column: ColumnDesc): string {
	    const name = column.columnName || '';

	    return name.split('.').pop() || '';
    }

    private map<T>(arr: Array<T>, callback: Function): Array<any> {
        return arr.map((value: T, i: number) => {
            return callback(value, i);
        });
    }

    private eachValue(typeDescriptor: PrimitiveTypeEntry, column: Column, callback: Function): Array<any> {
        switch (typeDescriptor.type) {
            case this.TCLIService_types.TTypeId.BOOLEAN_TYPE:
                return this.map(column[ColumnCode.boolVal].values, callback);
            case this.TCLIService_types.TTypeId.TINYINT_TYPE:
                return this.map(column[ColumnCode.byteVal].values, callback);
            case this.TCLIService_types.TTypeId.SMALLINT_TYPE:
                return this.map(column[ColumnCode.i16Val].values, callback);
            case this.TCLIService_types.TTypeId.INT_TYPE:
                return this.map(column[ColumnCode.i32Val].values, callback);
            case this.TCLIService_types.TTypeId.BIGINT_TYPE:
            case this.TCLIService_types.TTypeId.TIMESTAMP_TYPE:
                return this.map(column[ColumnCode.i64Val].values, callback);
            case this.TCLIService_types.TTypeId.FLOAT_TYPE:
            case this.TCLIService_types.TTypeId.DOUBLE_TYPE:
                return this.map(column[ColumnCode.doubleVal].values, callback);
            case this.TCLIService_types.TTypeId.BINARY_TYPE:
                return this.map(column[ColumnCode.binaryVal].values, callback);
            default:
                return this.map(column[ColumnCode.stringVal].values, callback);
        }
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
}