import ITransport from "../contracts/ITransport";

export default class HttpTransport implements ITransport {
    private httpOptions: object;

    constructor(httpOptions: object = {}) {
        this.httpOptions = httpOptions;
    }

    getTransport(): any {
        return this.httpOptions;
    }

    setOptions(option: string, value: any) {
        this.httpOptions = {
            ...this.httpOptions,
            [option]: value
        };
    }

    getOptions(): object {
        return this.httpOptions;
    }

    connect() {};
    addListener() {}
    removeListener() {}
    write() {}
    end() {}
    emit() {}
}
