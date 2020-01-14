import ITransport from "../contracts/ITransport";
export default class HttpTransport implements ITransport {
    private httpOptions;
    constructor(httpOptions?: any);
    getTransport(): any;
    setOptions(option: string, value: any): void;
    getOptions(): any;
    connect(): void;
    addListener(): void;
    removeListener(): void;
    write(): void;
    end(): void;
    emit(): void;
}
