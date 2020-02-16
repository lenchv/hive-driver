# Documentation

## Table contents

[1. Forewords](#1.-forewords) \
[2. HiveClient](#2.-hiveclient) \
[3. Workflow](#3.-workflow) \
[4. Example](#4.-example) \
[5. HiveDriver](#5.-hivedriver)

## 1. Forewords

The best way to get to know how the library works is to look through the code ([lib/](/lib/)).

## 2. HiveClient

The entry point is class [HiveClient](/lib/HiveClient.ts).

```
...
const client = new HiveClient(
    TCLIService,
    TCLIService_types,
);
```

TCLIService and TCLIService_types are generated from [TCLIService.thrift](https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift).

You can use the ones that provided by the driver:

```
const hive = require('hive-driver');
const { TCLIService, TCLIService_types } = hive.thrift;
...
```

or you can compile it on your own and provide via constructor ([details](https://thrift.apache.org/tutorial/))

```
thrift -r --gen js TCLIService.thrift
```

The driver is based on this API so more details you can find just looking at structures described in the thrift file ([TCLIService.thrift](/thrift/TCLIService.thrift)). 

Also, some errors related to the network connection are thrown asynchronously, so to handle such errors you should subscribe on "error" event:

```
client.on('error', (error) => {
    // ...
});
```

## 3. Workflow

The simplified workflow is next:

HiveClient::connect() -> HiveClient::openSession() -> HiveSession::&lt;method&gt; -> HiveOperation::fetch() -> HiveOperation::close() -> HiveSession::close() -> HiveClient::close()

### 3.1. Connect

```typescript
HiveClient::connect(
   options: IConnectionOptions,
   connectionProvider?: IConnectionProvider,
   authProvider?: IAuthentication
)
```

- [options](/lib/connection/contracts/IConnectionOptions.ts) contain host, port and options, mostly for connections provided by thrift module.

- [connectionProvider](/lib/connection/contracts/IConnectionProvider.ts) - [HttpConnection](/lib/connection/connections/HttpConnection.ts) or [TcpConnection](/lib/connection/connections/TcpConnection.ts), depends on transport mode the server uses: 

*hive-site.xml*
```xml
...
<property>
    <name>hive.server2.transport.mode</name>
    <value>http|binary</value>
</property>
```

- [authProvider](/lib/connection/contracts/IAuthentication.ts) - which class of authentication you should use depends on the "hive.server2.authentication" option of hive server and transport mode you use. 

*hive-site.xml*
```xml
...
<property>
    <name>hive.server2.authentication</name>
    <value>nosasl|none|ldap|kerberos</value>
</property>
```

- [NoSaslAuthentication.ts](/lib/connection/auth/NoSaslAuthentication.ts)

- [PlainHttpAuthentication.ts](/lib/connection/auth/PlainHttpAuthentication.ts)

- [PlainTcpAuthentication.ts](/lib/connection/auth/PlainTcpAuthentication.ts)

- [KerberosHttpAuthentication.ts](/lib/connection/auth/KerberosHttpAuthentication.ts)

- [KerberosTcpAuthentication.ts](/lib/connection/auth/KerberosTcpAuthentication.ts)

Notice that for both LDAP and None authentications you should use plain.

For more details see [connections.md](connections.md)

### 3.2 Open session

```typescript
HiveClient:openSeesion(
    request: OpenSessionRequest
): Promise<HiveSession>
```

[OpenSessionRequest](/lib/hive/Commands/OpenSessionCommand.ts) - the only required parameter is "client_protocol", which synchronize the version of HiveServer2 API. Into "configuration" you may set any of configurations that required for session of your Hive instance.

After the session is openned you will have the [HiveSession](/lib/HiveSession.ts) instance.

### 3.3 HiveSession

Class HiveSession is a facade for API that works with [SessionHandle](/lib/hive/Types/index.ts#L77).

Probably, the most useful method is `executeStatement`

```typescript
HiveSession::executeStatement(
    statement: string,
    options: ExecuteStatementOptions = {}
)
```

- statement is DDL/DML statement (CREATE TABLE, INSERT, UPDATE, SELECT, LOAD etc.)

- [options](/lib/contracts/IHiveSession.ts#L14)

   - runAsync allows to execute operation asynchronously.

   - confOverlay overides session configuration properties.

   - timeout is maximum time to execute operation. It has Buffer type, because timestamp in Hive has capacity 64. So for such value you should use [node-int64](https://www.npmjs.com/package/node-int64) npm module.

Fot more details see [hivesession.md](hivesession.md).

### 3.4 Operation

In most cases HiveSession methods return [HiveOperation](/lib/HiveOperation.ts), that helps you to retrieve requested data. Usually, operation has [TableSchema](/lib/hive/Types/index.ts#L143) and data (Array<[RowSet](/lib/hive/Types/index.ts#L218)>) as a result.

HiveOperation returns the result in raw format from thrift API.

To convert it to readable JSON you may use [HiveUtils::getResult()](/lib/utils/HiveUtils.ts#L23). But, you free to write your own transformer, depends on your needs.

For more details see [hiveoperation.md](hiveoperation.md).

### 3.5 Status

You may notice, that most of the operations return [Status](/lib/dto/Status.ts) that helps you to define the state of the operation. Also, status contains the error.

### 3.6 Finish

After you finish working with operation, session or client it is better to close it, each of them has a respective method (`close()`).

## 4. Example

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

## 5. HiveDriver

Class HiveDriver is the facade to direct Thrift API methods. You may use it for your particular needs, without any changes to the library. How to use it you may find at [examples/driver.js](/examples/driver.js);

To run examples you can use docker images from this repository, how to setup it you will find at [.docker](/.docker/).
