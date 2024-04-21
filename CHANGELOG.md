# Changelog

[1.0.0](https://github.com/lenchv/hive-driver/releases/tag/v1.0.0) 2024-04-21

- Updated npm modules
- Added UploadData and DownloadData methods of newest TCLIService.thrift
- Added npm provenance check

[0.3.1](https://github.com/lenchv/hive-driver/releases/tag/v0.3.0) 2024-03-15

- expose flush() in IOperation for proper work with massive data

[0.3.0](https://github.com/lenchv/hive-driver/releases/tag/v0.3.0) 2023-09-25

- Upgraded kerberos library

- Added parameter "orientation" to fetch method in order to force using FETCH_NEXT as first operation after initialization schema

- Fixed issue when on pending state the error was thrown

- Fixed issue when in some cases colum was undefined when parsing JsonResult

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
