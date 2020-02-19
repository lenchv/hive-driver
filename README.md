# Hive Driver
[![GitHub release](https://img.shields.io/github/release/lenchv/hive-driver.svg?style=flat-square)](https://github.com/lenchv/hive-driver/releases/latest)
[![test](https://github.com/lenchv/hive-driver/workflows/test/badge.svg?branch=master)](https://github.com/lenchv/hive-driver/actions?query=workflow%3Atest+branch%3Amaster)

## Description

Hive Driver is JS driver for connection to [Apache Hive](https://hive.apache.org/) via [Thrift API](https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift).

This driver is able to connect with SASL authentication mechanisms (ldap, plain, kerberos) using both http and tcp transport.

## Installation

```bash
npm i hive-driver
```

If you'd like to use kerberos, you have to install and build [kerberos](https://www.npmjs.com/package/kerberos) module seprately

```bash
npm i kerberos
```

## Usage

[examples/usage.js](examples/usage.js)
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
).then(async client => {
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
    const response = await session.getInfo(
        TCLIService_types.TGetInfoType.CLI_DBMS_VER
    );

    if (!response.status.success()) {
        throw response.status.getError();
    }

    console.log(response.value.getValue());

    await session.close();
}).catch(error => {
    console.log(error);
});
```

For more details see: [getting started](docs/readme.md) 

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
