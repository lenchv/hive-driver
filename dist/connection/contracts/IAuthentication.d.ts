import ITransport from "./ITransport";
export default interface IAuthentication {
    authenticate(connection: ITransport): Promise<ITransport>;
}
