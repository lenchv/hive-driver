# Changelog

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
