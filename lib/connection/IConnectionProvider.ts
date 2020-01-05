import IConnectionOptions from './IConnectionOptions';
import IConnection from './IConnection';

export default interface IConnectionProvider {
    connect(options: IConnectionOptions): Promise<IConnection>;
}