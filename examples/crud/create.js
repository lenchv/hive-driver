const TCLIService = require('../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../../index').HiveClient;
const mech = require('../../index').mechanisms;

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
    return createTable(session)
        .then(() => loadData(session))
        .then(() => select(session))
        .then(
            () => dropTable(session),
            error => {
                console.log(error);
                return dropTable(session);
            }
        )
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

const dropTable = (session) => {
    return execute(session, 'drop table pokes').then(result => {
        console.log('drop table:', result);
    });
};

const createTable = (session) => {
    return execute(session, 'CREATE TABLE pokes (foo INT, bar STRING)').then(result => {
        console.log('create table: ', result);
    });
};

const loadData = (session) => {
    return execute(session, 'LOAD DATA LOCAL INPATH \'/opt/hive/examples/files/kv1.txt\' OVERWRITE INTO TABLE pokes')
        .then((result) => {
            console.log('load data', result);
        })
};

const select = (session) => {
    return execute(session, 'select * from pokes order by foo').then(result => {
        console.log(result, result.length);
    });
};

const execute = (session, statement) => {
    return session.executeStatement(statement, { runAsync: true })
        .then((operation) => {
            return handleOperation(operation, {
                progress: false,
                callback: (error, stateResponse) => {
                    if (error) {
                        console.error(error.message);
                    }

                    console.log(stateResponse.taskStatus);
                }
            });
        });
};

const handleOperation = (operation, {
    progress = false,
    callback = () => {},
}) => {
    return operation.waitUntilReady(progress, callback)
    .then((operation) => {
        return fetchAll(operation);
    })
    .then(operation => {
        return operation.close();
    })
    .then(() => {
        return operation.result().getValue();
    })
};

const fetchAll = (operation) => {
    return operation.fetch()
        .then(() => {
            if (operation.hasMoreRows()) {
                return fetchAll(operation);
            } else {
                return operation;
            }
        });
};

