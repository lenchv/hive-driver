const { expect } = require('chai');
const JsonResult = require('../../dist/result/JsonResult').default;
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
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
    it('should convert schema and data to json', () => {
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
            "varch":"e"
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
            "varch":"f"
        }]);
    });
});
