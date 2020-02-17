const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
import _HiveClient from "./HiveClient";
import _HiveDriver from "./hive/HiveDriver";
import _HiveUtils from "./utils/HiveUtils";
import NoSaslAuthentication from "./connection/auth/NoSaslAuthentication";
import PlainTcpAuthentication from "./connection/auth/PlainTcpAuthentication";
import PlainHttpAuthentication from "./connection/auth/PlainHttpAuthentication";
import KerberosTcpAuthentication from "./connection/auth/KerberosTcpAuthentication";
import KerberosHttpAuthentication from "./connection/auth/KerberosHttpAuthentication";
import MongoKerberosAuthProcess from "./connection/auth/helpers/MongoKerberosAuthProcess";
import HttpConnection from "./connection/connections/HttpConnection";
import TcpConnection from "./connection/connections/TcpConnection";

export const auth = {
    helpers: {
        MongoKerberosAuthProcess
    },
    NoSaslAuthentication,
    PlainTcpAuthentication,
    PlainHttpAuthentication,
    KerberosTcpAuthentication,
    KerberosHttpAuthentication,
};

export const connections = {
    HttpConnection,
    TcpConnection
};

export const thrift = {
    TCLIService,
    TCLIService_types
};

export class HiveClient extends _HiveClient {}
export class HiveDriver extends _HiveDriver {}
export class HiveUtils extends _HiveUtils  {}
