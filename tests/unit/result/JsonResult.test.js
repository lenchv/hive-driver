const { expect } = require('chai');
const JsonResult = require('../../../dist/result/JsonResult').default;
const { TCLIService_types } = require('../../../').thrift;
const Int64 = require('node-int64');

const getColumnSchema = (name, type, position) => {
    return {
        columnName: name,
        typeDesc: {
            types: [{
                primitiveEntry: {
                    type
                }
            }]
        },
        position
    };
}

describe('JsonResult', () => {
    it('should convert schema with primitive types to json', () => {
        const schema = {
            columns: [
                getColumnSchema('table.str', TCLIService_types.TTypeId.STRING_TYPE, 1),
                getColumnSchema('table.int64', TCLIService_types.TTypeId.BIGINT_TYPE, 2),
                getColumnSchema('table.bin', TCLIService_types.TTypeId.BINARY_TYPE, 3),
                getColumnSchema('table.bool', TCLIService_types.TTypeId.BOOLEAN_TYPE, 4),
                getColumnSchema('table.char', TCLIService_types.TTypeId.CHAR_TYPE, 5),
                getColumnSchema('table.dbl', TCLIService_types.TTypeId.DOUBLE_TYPE, 6),
                getColumnSchema('table.flt', TCLIService_types.TTypeId.FLOAT_TYPE, 7),
                getColumnSchema('table.int', TCLIService_types.TTypeId.INT_TYPE, 8),
                getColumnSchema('table.small_int', TCLIService_types.TTypeId.SMALLINT_TYPE, 9),
                getColumnSchema('table.tiny_int', TCLIService_types.TTypeId.TINYINT_TYPE, 10),
                getColumnSchema('table.varch', TCLIService_types.TTypeId.VARCHAR_TYPE, 11),
                getColumnSchema('table.dec', TCLIService_types.TTypeId.DECIMAL_TYPE, 12),
                getColumnSchema('table.ts', TCLIService_types.TTypeId.TIMESTAMP_TYPE, 13),
                getColumnSchema('table.date', TCLIService_types.TTypeId.DATE_TYPE, 14),
                getColumnSchema('table.day_interval', TCLIService_types.TTypeId.INTERVAL_DAY_TIME_TYPE, 15),
                getColumnSchema('table.month_interval', TCLIService_types.TTypeId.INTERVAL_YEAR_MONTH_TYPE, 16),
            ]
        };
        const data = [
            {
                columns: [{
                    stringVal: { values: ['a', 'b'] }
                }, {
                    i64Val: { values: [new Int64(Buffer.from([0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01])), new Int64(Buffer.from([0x00, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02]))] }
                }, {
                    binaryVal: { values: [Buffer.from([1]), Buffer.from([2])] }
                }, {
                    boolVal: { values: [true, false] }
                }, {
                    stringVal: { values: ['c', 'd'] } 
                }, {
                    doubleVal: { values: [1.2, 1.3] } 
                }, {
                    doubleVal: { values: [2.2, 2.3] } 
                }, {
                    i32Val: { values: [1, 2] } 
                }, {
                    i16Val: { values: [3, 4] } 
                }, {
                    byteVal: { values: [5, 6] } 
                }, {
                    stringVal: { values: ['e', 'f'] } 
                }, {
                    stringVal: { values: ['2.1', '2.2'] } 
                }, {
                    stringVal: { values: ['2020-01-17 00:17:13.0', '2020-01-17 00:17:13.0'] } 
                }, {
                    stringVal: { values: ['2020-01-17', '2020-01-17'] } 
                }, {
                    stringVal: { values: ['1 00:00:00.000000000', '1 00:00:00.000000000'] } 
                }, {
                    stringVal: { values: ['0-1', '0-1'] } 
                }]
            }
        ];

        const result = new JsonResult(TCLIService_types);
        result.setOperation({
            getSchema: () => schema,
            getData: () => data,
        });

        expect(result.getValue()).to.be.deep.eq([{
            "str":"a",
            "int64":282578800148737,
            "bin": Buffer.from([1]),
            "bool":true,
            "char":"c",
            "dbl":1.2,
            "flt":2.2,
            "int":1,
            "small_int":3,
            "tiny_int":5,
            "varch":"e",
            "dec": 2.1,
            "ts": "2020-01-17 00:17:13.0",
            "date": "2020-01-17",
            "day_interval": "1 00:00:00.000000000",
            "month_interval": "0-1",
        }, {
            "str":"b",
            "int64":565157600297474,
            "bin":Buffer.from([2]),
            "bool":false,
            "char":"d",
            "dbl":1.3,
            "flt":2.3,
            "int":2,
            "small_int":4,
            "tiny_int":6,
            "varch":"f",
            "dec": 2.2,
            "ts": "2020-01-17 00:17:13.0",
            "date": "2020-01-17",
            "day_interval": "1 00:00:00.000000000",
            "month_interval": "0-1",
        }]);
    });

    it('should convert complex types', () => {
        const schema = {
            columns: [
                getColumnSchema('table.array', TCLIService_types.TTypeId.ARRAY_TYPE, 1),
                getColumnSchema('table.map', TCLIService_types.TTypeId.MAP_TYPE, 2),
                getColumnSchema('table.struct', TCLIService_types.TTypeId.STRUCT_TYPE, 3),
                getColumnSchema('table.union', TCLIService_types.TTypeId.UNION_TYPE, 4)
            ]
        };
        const data = [
            {
                columns: [{
                    stringVal: { values: ['["a", "b"]', '["c", "d"]'] }
                }, {
                    stringVal: { values: ['{ "key": 12 }', '{ "key": 13 }'] }
                }, {
                    stringVal: { values: ['{ "name": "Jon", "surname": "Doe" }', '{ "name": "Jane", "surname": "Doe" }'] }
                }, {
                    stringVal: { values: ['{0:12}', '{1:"foo"}'] }
                }]
            }
        ];

        const result = new JsonResult(TCLIService_types);
        result.setOperation({
            getSchema: () => schema,
            getData: () => data,
        });

        expect(result.getValue()).to.be.deep.eq([{
            array: ["a", "b"],
            map: { "key": 12 },
            struct: { "name": "Jon", "surname": "Doe" },
            union: '{0:12}',
        }, {
            array: ["c", "d"],
            map: { "key": 13 },
            struct: { "name": "Jane", "surname": "Doe" },
            union: '{1:"foo"}',
        }]);
    });

    it('should merge data items', () => {
        const schema = {
            columns: [
                getColumnSchema('table.id', TCLIService_types.TTypeId.STRING_TYPE, 1),
            ]
        };
        const data = [
            {
                columns: [{
                    stringVal: { values: ['0', '1'] }
                }]
            },
            {
                columns: [{
                    stringVal: { values: ['2', '3'] }
                }]
            }
        ];

        const result = new JsonResult(TCLIService_types);
        result.setOperation({
            getSchema: () => schema,
            getData: () => data,
        });

        expect(result.getValue()).to.be.deep.eq([
            { id: "0" },
            { id: "1" },
            { id: "2" },
            { id: "3" },
        ]);
    });

    it('should detect nulls', () => {
        const result = new JsonResult(TCLIService_types);
        const buf = Buffer.from([0x55, 0xAA, 0xC3]);
        
        [
            true, false, true, false, true, false, true, false, // 0x55
            false, true, false, true, false, true, false, true, // 0xAA,
            true, true, false, false, false, false, true, true, // 0xC3 
        ].forEach((value, i) => {
            expect(result.isNull(buf, i), i).to.be.eq(value);
        });
    });

     it('should detect nulls for each type', () => {
        const schema = {
            columns: [
                getColumnSchema('table.str', TCLIService_types.TTypeId.STRING_TYPE, 1),
                getColumnSchema('table.int64', TCLIService_types.TTypeId.BIGINT_TYPE, 2),
                getColumnSchema('table.bin', TCLIService_types.TTypeId.BINARY_TYPE, 3),
                getColumnSchema('table.bool', TCLIService_types.TTypeId.BOOLEAN_TYPE, 4),
                getColumnSchema('table.char', TCLIService_types.TTypeId.CHAR_TYPE, 5),
                getColumnSchema('table.dbl', TCLIService_types.TTypeId.DOUBLE_TYPE, 6),
                getColumnSchema('table.flt', TCLIService_types.TTypeId.FLOAT_TYPE, 7),
                getColumnSchema('table.int', TCLIService_types.TTypeId.INT_TYPE, 8),
                getColumnSchema('table.small_int', TCLIService_types.TTypeId.SMALLINT_TYPE, 9),
                getColumnSchema('table.tiny_int', TCLIService_types.TTypeId.TINYINT_TYPE, 10),
                getColumnSchema('table.varch', TCLIService_types.TTypeId.VARCHAR_TYPE, 11),
                getColumnSchema('table.dec', TCLIService_types.TTypeId.DECIMAL_TYPE, 12),
                getColumnSchema('table.ts', TCLIService_types.TTypeId.TIMESTAMP_TYPE, 13),
                getColumnSchema('table.date', TCLIService_types.TTypeId.DATE_TYPE, 14),
                getColumnSchema('table.day_interval', TCLIService_types.TTypeId.INTERVAL_DAY_TIME_TYPE, 15),
                getColumnSchema('table.month_interval', TCLIService_types.TTypeId.INTERVAL_YEAR_MONTH_TYPE, 16),
            ]
        };
        const data = [
            {
                columns: [{
                    stringVal: { values: ['a'], nulls: Buffer.from([0x01]) }
                }, {
                    i64Val: { values: [new Int64(Buffer.from([0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]))], nulls: Buffer.from([0x01]) }
                }, {
                    binaryVal: { values: [Buffer.from([1])], nulls: Buffer.from([0x01]) }
                }, {
                    boolVal: { values: [true], nulls: Buffer.from([0x01]) }
                }, {
                    stringVal: { values: ['c'], nulls: Buffer.from([0x01]) } 
                }, {
                    doubleVal: { values: [1.2], nulls: Buffer.from([0x01]) } 
                }, {
                    doubleVal: { values: [2.2], nulls: Buffer.from([0x01]) } 
                }, {
                    i32Val: { values: [1], nulls: Buffer.from([0x01]) } 
                }, {
                    i16Val: { values: [3], nulls: Buffer.from([0x01]) } 
                }, {
                    byteVal: { values: [5], nulls: Buffer.from([0x01]) } 
                }, {
                    stringVal: { values: ['e'], nulls: Buffer.from([0x01]) } 
                }, {
                    stringVal: { values: ['2.1'], nulls: Buffer.from([0x01]) } 
                }, {
                    stringVal: { values: ['2020-01-17 00:17:13.0'], nulls: Buffer.from([0x01]) } 
                }, {
                    stringVal: { values: ['2020-01-17'], nulls: Buffer.from([0x01]) } 
                }, {
                    stringVal: { values: ['1 00:00:00.000000000'], nulls: Buffer.from([0x01]) } 
                }, {
                    stringVal: { values: ['0-1'], nulls: Buffer.from([0x01]) } 
                }]
            }
        ];

        const result = new JsonResult(TCLIService_types);
        result.setOperation({
            getSchema: () => schema,
            getData: () => data,
        });

        expect(result.getValue()).to.be.deep.eq([{
            "str": null,
            "int64": null,
            "bin": null,
            "bool": null,
            "char": null,
            "dbl": null,
            "flt": null,
            "int": null,
            "small_int": null,
            "tiny_int": null,
            "varch": null,
            "dec": null,
            "ts": null,
            "date": null,
            "day_interval": null,
            "month_interval": null,
        }]);
    });
});
