const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../index').HiveClient;
const HiveUtils = require('../index').HiveUtils;
const mech = require('../index').mechanisms;

const utils = new HiveUtils(
    TCLIService_types
);
const connection = new mech.NoSaslTcpConnection();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect({
    host: '192.168.99.100',
    port: 10000,
    options: {}
}, connection).then(client => {
    return client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
}).then((session) => {
    return testPrimitiveTypes(session)
        .then(() => testComplexTypes(session))
        .then(() => testIntervals(session))
        .then(() => {
            return session.close();
        });
}).then(status => {
    if (!status.success()) {
        throw status.getError();
    }
    console.log(status.success());
}).catch(error => {
    console.log(error);
});

const testPrimitiveTypes = (session) => {
    return execute(session, `
        CREATE TABLE primitiveTypes (
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
        )`)
        .then(() => execute(session, `insert into primitiveTypes (
            bool,
            tiny_int,
            small_int,
            int_type,
            big_int,
            flt,
            dbl,
            dec,
            str,
            ts,
            bin,
            chr,
            vchr,
            dat
        ) values (
            true,
            255,
            65535,
            4000000,
            372036854775807,
            1.2,
            2.2,
            3.2,
            'data',
            '2014-01-17 00:17:13',
            'data',
            'a',
            'b',
            '2014-01-17'
        )`))
        .then(() => {
            return execute(session, 'select * from primitiveTypes');
        })
        .then(console.log)
        .then(
            () =>  execute(session, 'drop table primitiveTypes'),
            (error) => {
                console.error(error);
                execute(session, 'drop table primitiveTypes')
            }
        );
};

const testIntervals = (session) => {
    return execute(session, `
        CREATE TABLE intervalTypes AS
            SELECT INTERVAL '1' day AS day_interval, 
            INTERVAL '1' month AS month_interval
    `)
    .then(() => execute(session, `desc intervalTypes`))
    .then(console.log)
    .then(() => execute(session, 'select * from intervalTypes'))
    .then(console.log)
    .then(
        () =>  execute(session, 'drop table intervalTypes'),
        () =>  execute(session, 'drop table intervalTypes')
    );
};

const testComplexTypes = (session) => {
    return execute(session, `create table dummy( id string )`)
        .then(() => execute(session, `insert into dummy (id) values (1)`))
        .then(() => execute(session, `
            CREATE TABLE complexTypes (
                arr_type array<string>,
                map_type map<string, int>,
                struct_type struct<city:string,State:string>,
                union_type uniontype<string,double,int>
            )
        `))
        .then(() => execute(session, `
            INSERT INTO table complexTypes SELECT
                array('a', 'b') as arr_type,
                map('key', 12) as map_type,
                named_struct('city','Tampa','State','FL') as struct_type,
                create_union(0, 'value', cast(0.0 as double), 0) as union_type
            FROM dummy
        `))
        .then(() => execute(session, `
            INSERT INTO table complexTypes SELECT
                array('c', 'd') as arr_type,
                map('key2', 12) as map_type,
                named_struct('city','Albany','State','NY') as struct_type,
                create_union(1, '', cast(0.1 as double), 0) as union_type
            FROM dummy
        `))
        .then(() => execute(session, `
            INSERT INTO table complexTypes SELECT
                array('e', 'd') as arr_type,
                map('key2', 13) as map_type,
                named_struct('city','Los Angeles','State','CA') as struct_type,
                create_union(2, '', cast(0.0 as double), 12) as union_type
            FROM dummy
        `))
        .then(() => {
            return execute(session, 'select * from complexTypes')
        })
        .then(console.log)
        .then(() => Promise.all([
            execute(session, 'drop table dummy'),
            execute(session, 'drop table complexTypes')
        ]), (error) => {
            console.error(error);
            return Promise.all([
                execute(session, 'drop table dummy'),
                execute(session, 'drop table complexTypes')
            ])
        });
};

const execute = (session, statement) => {
    return session.executeStatement(statement, { runAsync: true })
        .then((operation) => {
            return handleOperation(operation, {
                progress: true,
                callback: (stateResponse) => {
                    console.log(stateResponse.taskStatus);
                }
            });
        });
};

const handleOperation = (operation, {
    progress = false,
    callback = () => {},
}) => {
    return utils.waitUntilReady(operation, progress, callback)
    .then((operation) => {
        return utils.fetchAll(operation);
    })
    .then(operation => {
        return operation.close();
    })
    .then(() => {
        return utils.getResult(operation).getValue();
    })
};

