const hive = require('../');
const TCLIService_types = hive.thrift.TCLIService_types;
const connection = require('./connections/hdinsight');

const utils = new hive.HiveUtils(
    TCLIService_types
);

connection().then(client => {
    client.on('error', (error) => {
        console.error(error);
    });
    
    return client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V8
    }).then(async (session) => {
        await testPrimitiveTypes(session);
        await testComplexTypes(session); 
        await testIntervals(session);
        
        return await session.close();
    }).then(status => {
        console.log(status.success());

        return client.close();
    }).catch(error => {
        console.log(error);
        return client.close();
    });
});

const testPrimitiveTypes = async (session) => {
    try {
        console.log('[info] create primitiveTypes');
        await execute(session, `
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
        );
        console.log('[info] insert into primitiveTypes');
        await execute(session, `insert into primitiveTypes (
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
        )`);
        console.log('[info] fetch primitiveTypes');
        const result = await execute(session, 'select * from primitiveTypes');
        
        console.log(result);
    } finally {
        await execute(session, 'drop table primitiveTypes');
    }
};

const testIntervals = async (session) => {
    try {
        console.log('[info] create intervalTypes');
        await execute(session, `
            CREATE TABLE IF NOT EXISTS intervalTypes AS
                SELECT INTERVAL '1' day AS day_interval, 
                INTERVAL '1' month AS month_interval
        `);
        console.log('[info] describe intervalTypes');
        console.log(await execute(session, `desc intervalTypes`));
        console.log('[info] fetch intervalTypes');
        console.log(await execute(session, 'select * from intervalTypes'));
    } finally {
        await execute(session, 'drop table intervalTypes');
    }
};

const testComplexTypes = async (session) => {
    try {
        console.log('[info] create dummy');
        await execute(session, `create table dummy( id string )`)
        console.log('[info] insert dummy value');
        await execute(session, `insert into dummy (id) values (1)`);
        console.log('[info] create complexTypes');
        await execute(session, `
            CREATE TABLE complexTypes (
                arr_type array<string>,
                map_type map<string, int>,
                struct_type struct<city:string,State:string>,
                union_type uniontype<string,double,int>
            )
        `);
        console.log('[info] 1. insert complexTypes');
        await execute(session, `
            INSERT INTO table complexTypes SELECT
                array('a', 'b') as arr_type,
                map('key', 12) as map_type,
                named_struct('city','Tampa','State','FL') as struct_type,
                create_union(0, 'value', cast(0.0 as double), 0) as union_type
            FROM dummy
        `);
        console.log('[info] 2. insert complexTypes');
        await execute(session, `
            INSERT INTO table complexTypes SELECT
                array('c', 'd') as arr_type,
                map('key2', 12) as map_type,
                named_struct('city','Albany','State','NY') as struct_type,
                create_union(1, '', cast(0.1 as double), 0) as union_type
            FROM dummy
        `);
        console.log('[info] 3. insert complexTypes');
        await execute(session, `
            INSERT INTO table complexTypes SELECT
                array('e', 'd') as arr_type,
                map('key2', 13) as map_type,
                named_struct('city','Los Angeles','State','CA') as struct_type,
                create_union(2, '', cast(0.0 as double), 12) as union_type
            FROM dummy
        `);
        console.log('[info] fetch complexTypes');
        console.log(await execute(session, 'select * from complexTypes'));
    } finally {
        await Promise.all([
            execute(session, 'drop table dummy'),
            execute(session, 'drop table complexTypes')
        ]);
    }
};

const execute = async (session, statement) => {
    const operation = await session.executeStatement(statement, { runAsync: true });
    
    return await handleOperation(operation, {
        progress: true,
        callback: (stateResponse) => {
            if (stateResponse.taskStatus) {
                console.log(stateResponse.taskStatus);
            } else {
                console.log(utils.formatProgress(stateResponse.progressUpdateResponse));
            }
        }
    });
};

const handleOperation = async (operation, {
    progress = false,
    callback = () => {},
}) => {
    await utils.waitUntilReady(operation, progress, callback)
    await utils.fetchAll(operation);
    await operation.close();
    
    return utils.getResult(operation).getValue();
};

