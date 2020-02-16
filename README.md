# Hive Driver

## Description

Hive Driver is JS driver for connection to [Apache Hive](https://hive.apache.org/) via [Thrift API](https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift).

This driver is able to connect with SASL authentication mechanisms (ldap, Plain, kerberos) using both http and tcp transport.

## Installation

```bash
npm i hive-driver
```

*NOTICE*:

If you'd like to use kerberos auth process, you have to install and build [kerberos](https://www.npmjs.com/package/kerberos) module seprately

```bash
npm i kerberos
```

## Usage

```javascript
const hive = require('hive-driver');
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(client => {
    return client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
}).then(session => {
    return session.getInfo(
        TCLIService_types.TGetInfoType.CLI_DBMS_VER
    ).then(response => {
        if (!response.status.success()) {
            throw response.status.getError();
        }

        console.log(response.value.getValue());
    }).then(() => {
        return session.close();
    });
}).catch(error => {
    console.log(error);
});
```

See [examples/usage.js](examples/usage.js)

## Test

Unit tests:

```bash
npm run test
```

e2e tests:

```bash
npm run e2e
```

*NOTICE*

e2e tests use dockerized Hive instances, for more details see: [.docker](.docker/)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Issues

If find any troubles with driver feel free to create an issue.

## License
 
[MIT License](LICENSE)

Copyright (c) 2020 Volodymyr Liench
