# Getting started

## Table contents

1. [Forewords](#forewords) 
2. [HiveDriver](#hivedriver)
3. [HiveClient](#hiveclient) \
   3.1 [TCLIService and TCLIService_types](#tcliservice-and-tcliservice_types)\
   3.2 [Connection](#connection)
4. [HiveSession](#hivesession) 
5. [HiveOperation](#hiveoperation) \
   5.1 [HiveUtils](#hiveutils)
6. [Status](#status) 
7. [Finalize](#finalize)
8. [Example](#example) 

## Forewords

The library is written using TypeScript, so the best way to get to know how it works is to look through the code ([lib/](/lib/)), [tests/e2e](/tests/e2e/) and [examples](/examples).

The main goal of this driver not only to implement the different auth methods but also give you the flexibility for usage.

If you find any mistakes, misleading or some confusion feel free to create an issue or send a pull request and we will discuss it.

## HiveDriver

The core of the library is [HiveDriver](/lib/hive/HiveDriver.ts). It is the facade for [TCLIService.thrift](https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift) methods. You can use this facade directly following the [examples/driver.js](/examples/driver.js).

But, the simplier way is to use [HiveClient](/lib/HiveClient.ts). Basically, the driver is used by [HiveClient](/lib/HiveClient.ts), [HiveSession](/lib/HiveSession.ts) and [HiveOperation](/lib/HiveOperaion.ts). The main process is the next: HiveClient produces HiveSession, and HiveSession produces HiveOperation. Let's discuss how it works.

## HiveClient

The entry point is class [HiveClient](/lib/HiveClient.ts). Client initiates connection to the server.

```javascript
const hive = require('hive-driver');
const client = new HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types,
);

client.on('error', error => /* ... */);

await client.connect({ host: 'localhost', port: 10000 });
...
await client.close();
```

You may guess that some errors related to the network are thrown asynchronously and the driver does not maintain these cases, you should handle it on your own. The simplest way is to subscribe on "error" event:

```javascript
client.on('error', (error) => {
    // ...
});
```

### TCLIService and TCLIService_types

TCLIService and TCLIService_types are generated from [TCLIService.thrift](https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift).

You can use the ones that provided by the driver or you can compile it on your own and provide via constructor to HiveClient ([details](https://thrift.apache.org/tutorial/)).

```
thrift -r --gen js TCLIService.thrift
```

TCLIService_types contains an amount of constants that API uses, so to use some operation you should be familiar with structures of [TCLIService.thrift](/thrift/TCLIService.thrift). Also, you may notice that most of the internal structures repeat the structures from [TCLIService.thrift](/thrift/TCLIService.thrift).

### Connection

Connection to the database includes choosing both transport and authentication. By default driver works in binary mode (tcp) with NoSASL authentication. To find out how your server works you should look to the *hive-site.xml* configuration.

*hive-site.xml*
```xml
...
<property>
    <name>hive.server2.transport.mode</name>
    <value>http|binary</value>
</property>
<property>
    <name>hive.server2.authentication</name>
    <value>nosasl|none|ldap|kerberos</value>
</property>
```

To connect via binary mode you should use [TcpConnection](/lib/connection/connections/TcpConnection.ts) and via http [HttpConnection](/lib/connection/connections/HttpConnection.ts).

*NOTICE*: http transport mode also requires "path" parameter which is passed by options.

For authentication the driver supports: nosasl, none, ldap and kerberos. For each of type you can choose appropriate handler:

- [NoSaslAuthentication.ts](/lib/connection/auth/NoSaslAuthentication.ts)

- [PlainHttpAuthentication.ts](/lib/connection/auth/PlainHttpAuthentication.ts)

- [PlainTcpAuthentication.ts](/lib/connection/auth/PlainTcpAuthentication.ts)

- [KerberosHttpAuthentication.ts](/lib/connection/auth/KerberosHttpAuthentication.ts)

- [KerberosTcpAuthentication.ts](/lib/connection/auth/KerberosTcpAuthentication.ts)

*NOTICE*

- for none and ldap you should use PlainHttpAuthentication or PlainTcpAuthentication.

- current kerberos process uses mongodb [kerberos](https://www.npmjs.com/package/kerberos) module, which does not support different kinds of QOP, so make sure you use "auth":

*hive-site.xml*
```xml
...
<property>
    <name>hive.server2.thrift.sasl.qop</name>
    <value>auth</value>
</property>
```

- to use kerberos you have to install and build npm [kerberos](https://www.npmjs.com/package/kerberos) module on your own, it is not included to the driver as dependency.

- you may write your own implementation of kerberos auth process by implementing [IKerberosAuthProcess.ts](lib/connection/contracts/IKerberosAuthProcess.ts) and pass it to the constructor of KerberosHttpAuthentication or KerberosTcpAuthentication

### Example

http/ldap
```javascript
const hive = require('hive-driver');
...
await client.connect(
    {
        host: 'localhost',
        port: 10001,
        options: {
            path: '/hive'
        }
    },
    new hive.connections.HttpConnection(),
    new hive.auth.PlainHttpAuthentication({
        username: 'admin',
        password: '123456'
    })
);
```

binary/ldap
```javascript
const hive = require('hive-driver');
...
await client.connect(
    {
        host: 'localhost',
        port: 10000
    },
    new hive.connections.TcpConnection(),
    new hive.auth.PlainTcpAuthentication({
        username: 'admin',
        password: '123456'
    })
);
```

For more details see:

- [examples/connections/](/examples/connections/)
- [tests/e2e/connection/connection.test.js](/tests/e2e/connection/connection.test.js)
- [.docker/confs](/.docker/confs/)

## 3 HiveSession

After you connect to the server you should open session to start working with Hive server.

```javascript
...
const session = await client.openSeesion({
    client_protocol: hive.thrift.TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
});
```

To open session you must provide [OpenSessionRequest](/lib/hive/Commands/OpenSessionCommand.ts#L20) - the only required parameter is "client_protocol", which synchronizes the version of HiveServer2 API.

Into "configuration" you may set any of configurations that required for session of your Hive instance.

After the session is openned you will have the [HiveSession](/lib/HiveSession.ts) instance.

Class [HiveSession](/lib/HiveSession.ts) is a facade for API that works with [SessionHandle](/lib/hive/Types/index.ts#L77).

The method you will use the most is `executeStatement`

```javascript
...
const operation = await session.executeStatement(
    'CREATE TABLE IF NOT EXISTS pokes (foo INT, bar STRING)',
    { runSync: true }
);
```

- statement is DDL/DML statement (CREATE TABLE, INSERT, UPDATE, SELECT, LOAD etc.)

- [options](/lib/contracts/IHiveSession.ts#L14)

   - runAsync allows to execute operation asynchronously.

   - confOverlay overides session configuration properties.

   - timeout is maximum time to execute operation. It has Buffer type, because timestamp in Hive has capacity 64. So for such value you should use [node-int64](https://www.npmjs.com/package/node-int64) npm module.

To know others methods see [hivesession.md](hivesession.md).

## HiveOperation

In most cases HiveSession methods return [HiveOperation](/lib/HiveOperation.ts), that helps you to retrieve requested data.

After you fetch the result, operation will have [TableSchema](/lib/hive/Types/index.ts#L143) and data (Array<[RowSet](/lib/hive/Types/index.ts#L218)>).

### HiveUtils

Operation is executed asynchrnously, so before retrieving the result, you have to wait until it has finished state.

```javascript
...
const response = await operation.status();
const isReady = response.operationState === TCLIService_types.TOperationState.FINISHED_STATE;
```

Also, the result is fetched by portitions, the size of a portion you can set by method [setMaxRows()](/lib/HiveOperation.ts#L115).

```javascript
...
operation.setMaxRows(500);
const status = await operation.fetch();
```

After you fetch all data and you have schema and set of data, you can transfrom data in readable format. 

```javascript
...
const schema = operation.getSchema();
const data = operation.getData();
```

To simplify this process, you may use [HiveUtils](/lib/utils/HiveUtils.ts).

```typescript
/**
 * Executes until operation has status finished or has one of the invalid states
 * 
 * @param operation
 * @param progress flag for operation status command. If it sets true, response will include progressUpdateResponse with progress information
 * @param callback if callback specified it will be called each time the operation status response received and it will be passed as first parameter
 */
waitUntilReady(
    operation: IOperation,
    progress?: boolean,
    callback?: Function
): Promise<IOperation>

/**
 * Fetch data until operation hasMoreRows
 * 
 * @param operation
 */
fetchAll(operation: IOperation): Promise<IOperation>

/**
 * Transforms operation result
 * 
 * @param operation
 * @param resultHandler - you may specify your own handler. If not specified the result is transformed to JSON
 */
getResult(
    operation: IOperation,
    resultHandler?: IOperationResult
): IOperationResult
```

*NOTICE*

- [node-int64](https://www.npmjs.com/package/node-int64) is used for types with capacity 64

- to know how data is presented in JSON you may look at [JsonResult.test.js](/tests/unit/result/JsonResult.test.js)

For more details see [hiveoperation.md](hiveoperation.md).

### Example

```javascript
const hive = require('hive-driver');
const utils = new hive.HiveUtils(hive.thrift.TCLIService_types);
...
await utils.waitUntilReady(
    operation,
    true,
    (stateResponse) => {
        console.log(stateResponse.taskStatus);
    }
);
await utils.fetchAll(operation);

const result = utils.getResult(operation).getValue();
```

## Status

You may notice, that most of the operations return [Status](/lib/dto/Status.ts) that helps you to define the state of the operation. Also, status contains the error.

## Finalize

After you finish working with operation, session or client it is better to close it, each of them has a respective method (`close()`).

## Example

[example.js](/examples/example.js)
```javascript
const hive = require('hive-driver');
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);
const utils = new hive.HiveUtils(
    TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(async client => {
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
    
    const createTableOperation = await session.executeStatement(
        'CREATE TABLE IF NOT EXISTS pokes (foo INT, bar STRING)'
    );
    await utils.waitUntilReady(createTableOperation, false, () => {});
    await createTableOperation.close();
    
    const loadDataOperation = await session.executeStatement(
        'LOAD DATA LOCAL INPATH \'/opt/apache-hive-2.3.6-bin/examples/files/kv1.txt\' OVERWRITE INTO TABLE pokes'
    );
    await utils.waitUntilReady(loadDataOperation, false, () => {});
    await loadDataOperation.close();
    
    const selectDataOperation = await session.executeStatement(
        'select * from pokes', { runAsync: true }
    );
    await utils.waitUntilReady(selectDataOperation, false, () => {});
    await utils.fetchAll(selectDataOperation);
    await selectDataOperation.close();
    
    const result = utils.getResult(selectDataOperation).getValue();
    
    console.log(JSON.stringify(result, null, '\t'));
    
    await session.close();
    await client.close();
})
.catch(error => {
    console.error(error);
});
```

To run examples you can use docker images from this repository, how to setup it you will find at [.docker](/.docker/).
