import Connection from './Connection'; 
import IConnectionOptions from './IConnectionOptions';

export default interface IConnectionProvider {
    connect(options: IConnectionOptions): Promise<Connection>;
}