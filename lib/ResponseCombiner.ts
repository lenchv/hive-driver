const Big = require('big.js');

import { ResultSetMetadataResponse, TCLIServiceTypes } from "./hive/ThriftService";
import { ExecuteStatementResult } from "./ExecuteStatementResponse";

export default class ResponseCombiner {
    private TCLIService_types: TCLIServiceTypes;
    
    constructor(TCLIService_types: TCLIServiceTypes) {
        this.TCLIService_types = TCLIService_types;
    }

    combine(response: ExecuteStatementResult): Array<object> {
        const { schema, data } = response;
        const columns = this.getSchemaColumns(schema);

        return data.reduce((result, response) => {
            const values = response?.results?.columns || [];
            const rows = this.getRows(
                values,
                columns
            );

            return result.concat(rows);
        }, []);   
    }

    private getSchemaColumns(schema: ResultSetMetadataResponse): Array<any> {
        return [...(schema.schema?.columns || [])]
            .sort((c1, c2) => c1.position > c2.position ? 1 : c1.position < c2.position ? -1 : 0);
    }

    private getRows(values: Array<any>, columns: Array<any>): Array<any> {
        return columns.reduce((rows, column) => {
            return this.getSchemaValues(
                column,
                values[column.position - 1]
            ).reduce((result, value, i) => {
                if (!result[i]) {
                    result[i] = {};
                }

                const name = this.getColumnName(column);

                result[i][name] = value;

                return result;
            }, rows);
        }, []);
    }

    private getSchemaValues(column: any, value: any): Array<any> {
        const typeDescriptor = (column?.typeDesc?.types || [{}])[0].primitiveEntry || {};
        const valueType = this.getValueType(typeDescriptor);
        const values = value[valueType]?.values || [];

        return values.map((value: any) => this.convertData(typeDescriptor, value));
    }

    private getColumnName(column: any): string {
	    const name = column?.columnName || '';

	    return name.split('.').pop();
    }

    private getValueType(typeDescriptor: { type: string }): string {
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
    }

    private convertData(typeDescriptor: { type: string }, value: any): any {
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
        const result = this.toInt64(value.buffer, value.offset);
        const max = new Big(Number.MAX_SAFE_INTEGER);

        if (result.cmp(max) > 0) {
            return Number.MAX_SAFE_INTEGER;
        } else {
            return parseInt(result.toString());
        }
    }

    toInt64(buffer: any, offset: any): any {
        const b = buffer;
        const o = offset;
    
        const negate = b[o] & 0x80;
        let value = new Big(0);
        let m = new Big(1);
        let carry = 1;
    
        for (let i = 7; i >= 0; i -= 1) {
            let v = b[o + i];
    
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
}