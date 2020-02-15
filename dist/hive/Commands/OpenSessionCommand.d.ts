import { Status, SessionHandle } from "../Types";
import BaseCommand from "./BaseCommand";
/**
 * For auth mechanism GSSAPI the host and service should be provided when session is opened.
 */
declare type SessionConfiguration = {
    krb_host?: string;
    krb_service?: string;
    [key: string]: any;
};
/**
 * @param client_protocol  One of the values TCLIService_types.TProtocolVersion. May be different depends on version of Hive you use.
 *                         For instance, for Hive lower that 3.x it is better to use HIVE_CLI_SERVICE_PROTOCOL_V8.
 * @param username         if authorization is used you should define username and password
 * @param password
 * @param configuration    in case of GSSAPI you should define configuration
 */
export declare type OpenSessionRequest = {
    client_protocol: number;
    username?: string;
    password?: string;
    configuration?: SessionConfiguration;
};
export declare type OpenSessionResponse = {
    status: Status;
    serverProtocolVersion: number;
    sessionHandle: SessionHandle;
    configuration?: SessionConfiguration;
};
export default class OpenSessionCommand extends BaseCommand {
    execute(openSessionRequest: OpenSessionRequest): Promise<OpenSessionResponse>;
}
export {};
