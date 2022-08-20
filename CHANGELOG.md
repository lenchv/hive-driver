# Changelog

[0.2.0](https://github.com/lenchv/hive-driver/releases/tag/v0.2.0) 2022-08-20

- Fixed an issue with zero-based column start (Spark Thrift Server, Kyuubi, for example)

- Updated thrift and dev libraries


[0.1.5](https://github.com/lenchv/hive-driver/releases/tag/v0.1.5) 2021-05-16

- Added method `flush()` to operation class, in order to avoid memory allocation errors when working with massive amount of data

- Added an instruction how to connect via zookeeper using hive-driver

[0.1.4](https://github.com/lenchv/hive-driver/releases/tag/v0.1.4) 2020-07-03

- Fixed retrieving null values from the API

[0.1.3](https://github.com/lenchv/hive-driver/releases/tag/v0.1.3) 2020-03-30

- Added events to HiveClient: close, reconnecting, timeout

- Added throwing exception when connection is closed but session is tried to be opened

- Added method isConnected to the IThriftConnection interface

- Described in the troubleshooting.md how to reconnect when the connection is lost

[0.1.2](https://github.com/lenchv/hive-driver/releases/tag/v0.1.2) 2020-02-24

- Fixed setting response in OperationStateError

[0.1.1](https://github.com/lenchv/hive-driver/releases/tag/v0.1.1) 2020-02-23

- Changed version in package.json
- Fixed retrieving data when Hive does not return hasResultSet
- Added formatting progressUpdateResponse
- Added connection example to Azure HDInsight


[0.1.0](https://github.com/lenchv/hive-driver/releases/tag/v0.1.0) 2020-02-17

- Implemented methods in HiveDriver for CLIService of HIVE_CLI_SERVICE_PROTOCOL_V11

- Added HiveClient, HiveSession, HiveOperation for interacation with HiveDriver

- Added HiveUtils to help retrieving data and present it as JSON

- Implemented Http and Tcp transports

- Implemented authentications: NoSASL, Plain, Kerberos

- Added kerberos authentication process via mongodb kerberos module

- Implemented SSL secured connection
