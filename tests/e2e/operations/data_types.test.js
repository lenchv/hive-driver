const { expect } = require('chai');
const logger = require('../utils/logger')(process.env.HIVE_E2E_LOG);
const instanceHelper = require('../utils/instanceHelper');
const driver = require('../../../');
const HiveClient = driver.HiveClient;
const { TCLIService, TCLIService_types } = require('../../../').thrift;

const utils = new driver.HiveUtils(
    TCLIService_types
);

const runInstance = () => {
    return instanceHelper.up('tcp.nosasl', logger);
};

const stopInstance = () => {
    return instanceHelper.down(logger);
};

const openSession = () => {
    const client = new HiveClient(
        TCLIService,
        TCLIService_types
    );

    return client.connect({
            hostname: 'localhost',
            port: 10000
        },
        new driver.connections.TcpConnection(),
        new driver.auth.NoSaslAuthentication()
    ).then(client => {
        return client.openSession({
            client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
        });
    });
};

const execute = (session, statement) => {
    return session.executeStatement(statement, { runAsync: true })
        .then(operation => handleOperation(operation, {
            progress: true,
            callback: (stateResponse) => {
                logger(stateResponse.taskStatus);
            }
        }));
};

const handleOperation = (operation, {
    progress = false,
    callback = () => {},
}) => {
    return utils.waitUntilReady(operation, progress, callback)
    .then(operation => utils.fetchAll(operation))
    .then(operation => operation.close())
    .then(() => utils.getResult(operation).getValue());
};

describe('Data types', () => {
    before(runInstance);
    after(stopInstance);

    it('primitive data types should presented correctly', () => {
        return openSession().then(session => {
            return execute(session, `DROP TABLE IF EXISTS primitiveTypes`)
            .then(() => execute(session, `
                CREATE TABLE IF NOT EXISTS primitiveTypes (
                    bool boolean,
                    tiny_int tinyint,
                    small_int smallint,
                    int_type int,
                    big_int bigint,
                    flt float,
                    dbl double,
                    dec decimal(3,2),
                    str string,
                    ts timestamp,
                    bin binary,
                    chr char(10),
                    vchr varchar(10),
                    dat date
                )`
            ))
            .then(() => execute(session, 'describe primitiveTypes'))
            .then(result => {
                expect(result).to.be.deep.eq([
                    {
                        "col_name": "bool",
                        "data_type": "boolean",
                        "comment": ""
                    },
                    {
                        "col_name": "tiny_int",
                        "data_type": "tinyint",
                        "comment": ""
                    },
                    {
                        "col_name": "small_int",
                        "data_type": "smallint",
                        "comment": ""
                    },
                    {
                        "col_name": "int_type",
                        "data_type": "int",
                        "comment": ""
                    },
                    {
                        "col_name": "big_int",
                        "data_type": "bigint",
                        "comment": ""
                    },
                    {
                        "col_name": "flt",
                        "data_type": "float",
                        "comment": ""
                    },
                    {
                        "col_name": "dbl",
                        "data_type": "double",
                        "comment": ""
                    },
                    {
                        "col_name": "dec",
                        "data_type": "decimal(3,2)",
                        "comment": ""
                    },
                    {
                        "col_name": "str",
                        "data_type": "string",
                        "comment": ""
                    },
                    {
                        "col_name": "ts",
                        "data_type": "timestamp",
                        "comment": ""
                    },
                    {
                        "col_name": "bin",
                        "data_type": "binary",
                        "comment": ""
                    },
                    {
                        "col_name": "chr",
                        "data_type": "char(10)",
                        "comment": ""
                    },
                    {
                        "col_name": "vchr",
                        "data_type": "varchar(10)",
                        "comment": ""
                    },
                    {
                        "col_name": "dat",
                        "data_type": "date",
                        "comment": ""
                    }
                ]);

                return execute(session, `insert into primitiveTypes (
                    bool, tiny_int, small_int, int_type, big_int, flt, dbl, dec, str, ts, bin, chr, vchr, dat
                ) values (
                    true, 127, 32000, 4000000, 372036854775807, 1.2, 2.2, 3.2, 'data', '2014-01-17 00:17:13', 'data', 'a', 'b', '2014-01-17'
                )`);
            }).then(() => {
                return execute(session, 'select * from primitiveTypes');
            }).then(result => {
                expect(result).to.be.deep.eq([
                    {
                        "bool": true,
                        "tiny_int": 127,
                        "small_int": 32000,
                        "int_type": 4000000,
                        "big_int": 372036854775807,
                        "flt": 1.2,
                        "dbl": 2.2,
                        "dec": 3.2,
                        "str": "data",
                        "ts": "2014-01-17 00:17:13.0",
                        "bin": Buffer.from('data'),
                        "chr": "a         ",
                        "vchr": "b",
                        "dat": "2014-01-17"
                    }
                ]);

                return session.close();
            }).catch(error => {
                logger(error);
                return session.close()
                    .then(() => Promise.reject(error));
            });
        });
    });

    it('interval types should be presented correctly', () => {
        return openSession().then(session => {
            return execute(session, `DROP TABLE IF EXISTS intervalTypes`)
            .then(() => execute(session, `
                    CREATE TABLE intervalTypes AS
                        SELECT INTERVAL '1' day AS day_interval, 
                        INTERVAL '1' month AS month_interval
                `
            ))
            .then(() => execute(session, 'describe intervalTypes'))
            .then(result => {
                expect(result).to.be.deep.eq([
                    {
                        "col_name": "day_interval",
                        "data_type": "interval_day_time",
                        "comment": ""
                    },
                    {
                        "col_name": "month_interval",
                        "data_type": "interval_year_month",
                        "comment": ""
                    }
                ]);

                return execute(session, 'select * from intervalTypes');
            }).then(result => {
                expect(result).to.be.deep.eq([
                    {
                        day_interval: "1 00:00:00.000000000",
                        month_interval: "0-1"
                    }
                ]);

                return session.close();
            }).catch(error => {
                logger(error);
                return session.close()
                    .then(() => Promise.reject(error));
            });
        }); 
    });

    it('complex types should be presented correctly', () => {
        return openSession().then(session => {
            return execute(session, `DROP TABLE IF EXISTS dummy`)
            .then(() => execute(session, `DROP TABLE IF EXISTS complexTypes`))
            .then(() => execute(session, `create table dummy( id string )`))
            .then(() => execute(session, `insert into dummy (id) values (1)`))
            .then(() => execute(session, `
                    CREATE TABLE complexTypes (
                        id int,
                        arr_type array<string>,
                        map_type map<string, int>,
                        struct_type struct<city:string,State:string>,
                        union_type uniontype<string,double,int>
                    )
                `
            ))
            .then(() => execute(session, 'describe complexTypes'))
            .then(result => {
                expect(result).to.be.deep.eq([
                    {
                        "col_name": "id",
                        "data_type": "int",
                        "comment": ""
                    },
                    {
                        "col_name": "arr_type",
                        "data_type": "array<string>",
                        "comment": ""
                    },
                    {
                        "col_name": "map_type",
                        "data_type": "map<string,int>",
                        "comment": ""
                    },
                    {
                        "col_name": "struct_type",
                        "data_type": "struct<city:string,State:string>",
                        "comment": ""
                    },
                    {
                        "col_name": "union_type",
                        "data_type": "uniontype<string,double,int>",
                        "comment": ""
                    }
                ]);

                return Promise.all([
                    execute(session, `
                        INSERT INTO table complexTypes SELECT
                            POSITIVE(1) as id,
                            array('a', 'b') as arr_type,
                            map('key', 12) as map_type,
                            named_struct('city','Tampa','State','FL') as struct_type,
                            create_union(0, 'value', cast(0.0 as double), 0) as union_type
                        FROM dummy
                    `),
                    execute(session, `
                        INSERT INTO table complexTypes SELECT
                            POSITIVE(2) as id,
                            array('c', 'd') as arr_type,
                            map('key2', 12) as map_type,
                            named_struct('city','Albany','State','NY') as struct_type,
                            create_union(1, '', cast(0.1 as double), 0) as union_type
                        FROM dummy
                    `),
                    execute(session, `
                        INSERT INTO table complexTypes SELECT
                            POSITIVE(3) as id,
                            array('e', 'd') as arr_type,
                            map('key2', 13) as map_type,
                            named_struct('city','Los Angeles','State','CA') as struct_type,
                            create_union(2, '', cast(0.0 as double), 12) as union_type
                        FROM dummy
                    `)
                ]);
            }).then(result => {
                return execute(session, 'select * from complexTypes order by id asc');
            }).then(result => {
                expect(result).to.be.deep.eq([
                    {
                        "id": 1,
                        "arr_type": [
                            "a",
                            "b"
                        ],
                        "map_type": {
                            "key": 12
                        },
                        "struct_type": {
                            "city": "Tampa",
                            "state": "FL"
                        },
                        "union_type": "{0:\"value\"}"
                    },
                    {
                        "id": 2,
                        "arr_type": [
                            "c",
                            "d"
                        ],
                        "map_type": {
                            "key2": 12
                        },
                        "struct_type": {
                            "city": "Albany",
                            "state": "NY"
                        },
                        "union_type": "{1:0.1}"
                    },
                    {
                        "id": 3,
                        "arr_type": [
                            "e",
                            "d"
                        ],
                        "map_type": {
                            "key2": 13
                        },
                        "struct_type": {
                            "city": "Los Angeles",
                            "state": "CA"
                        },
                        "union_type": "{2:12}"
                    }
                ]);

                return session.close();
            }).catch(error => {
                logger(error);
                return session.close()
                    .then(() => Promise.reject(error));
            });
        }); 
    });

    it('boolean types should be retrieved correctly', () => {
        return openSession().then(session => {
            return execute(session, `DROP TABLE IF EXISTS null_table`)
            .then(() => execute(session, `
                CREATE TABLE IF NOT EXISTS null_table (a INT, b BOOLEAN, c STRING)
            `))
            .then(() => {
                return execute(session, `
                    LOAD DATA LOCAL INPATH \'/opt/apache-hive-2.3.6-bin/examples/files/null.txt\' OVERWRITE INTO TABLE null_table
                `);
            }).then(() => {
                return execute(session, 'select * from null_table');
            }).then(result => {
                expect(result).to.be.deep.eq([
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": null,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": null,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    },
                    {
                        "a": 1,
                        "b": null,
                        "c": "same"
                    }
                ]);

                return session.close();
            }).catch(error => {
                logger(error);
                return session.close()
                    .then(() => Promise.reject(error));
            });
        });
    });
});
// !connect jdbc:hive2://localhost:10000/default;auth=noSasl
// !connect jdbc:hive2://zookeeper:2181/;serviceDiscoveryMode=zooKeeper;zooKeeperNamespace=hive_zookeeper_namespace
// !connect jdbc:hive2://zookeeper:2181/default;serviceDiscoveryMode=zooKeeper;zooKeeperNamespace=hiveserver2
// insert into booleanTypes (
//     bool1, bool2, bool3, bool4
// ) values (
//     false, true, false, false
// );

// select * from booleanTypes;