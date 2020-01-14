import IConnectionOptions from './IConnectionOptions';
import IAuthentication from './IAuthentication';
import IThriftConnection from './IThriftConnection';
export default interface IConnectionProvider {
    connect(options: IConnectionOptions, authProvider: IAuthentication): Promise<IThriftConnection>;
}
