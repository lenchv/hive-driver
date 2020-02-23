# Hive Driver
[![npm](https://img.shields.io/npm/v/hive-driver?color=blue&style=flat-square)](https://www.npmjs.com/package/hive-driver)
[![test](https://github.com/lenchv/hive-driver/workflows/test/badge.svg?branch=master)](https://github.com/lenchv/hive-driver/actions?query=workflow%3Atest+branch%3Amaster)
[![coverage](https://codecov.io/gh/lenchv/hive-driver/branch/master/graph/badge.svg)](https://codecov.io/gh/lenchv/hive-driver)

## Description

Hive Driver is a Java Script driver for connection to [Apache Hive](https://hive.apache.org/) via [Thrift API](https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift).

This driver can connect with SASL authentication mechanisms (such as LDAP, PLAIN, Kerberos) using both HTTP and TCP transport.

## Installation

```bash
npm i hive-driver
```

If you'd like to use Kerberos, you have to install and build the [kerberos](https://www.npmjs.com/package/kerberos) module on your own

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

    console.log(response.getValue());

    await session.close();
}).catch(error => {
    console.log(error);
});
```

For more details see: [Getting Started](docs/readme.md) 

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

e2e tests use dockerized Hive instance, for more details see: [.docker](.docker/)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Issues

If you find some issues, feel free to create an issue or send a pull request.

## License
 
[MIT License](LICENSE)

Copyright (c) 2020 Volodymyr Liench
