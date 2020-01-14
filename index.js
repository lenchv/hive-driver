const HiveClient = require('./dist/HiveClient').default;
const HiveDriver = require('./dist/hive/HiveDriver').default;
const NoSaslAuthentication = require('./dist/connection/auth/NoSaslAuthentication').default;
const PlainTcpAuthentication = require('./dist/connection/auth/PlainTcpAuthentication').default;
const PlainHttpAuthentication = require('./dist/connection/auth/PlainHttpAuthentication').default;
const HttpConnection = require('./dist/connection/connections/HttpConnection').default;
const TcpConnection = require('./dist/connection/connections/TcpConnection').default;
const HiveUtils = require('./dist/utils/HiveUtils').default;

module.exports = {
    HiveClient,
    HiveDriver,
    HiveUtils,
    auth: {
        NoSaslAuthentication,
        PlainTcpAuthentication,
        PlainHttpAuthentication,
    },
    connections: {
        HttpConnection,
        TcpConnection
    }
};
