import { TCLIServiceTypes, ThriftResponse, ThriftClient } from "../ThriftService";

export default class FetchResult {
    private TCLIService_types: TCLIServiceTypes;
    private client: ThriftClient;
    private response: ThriftResponse;
    private limit: number;

    constructor(
        TCLIService_types: TCLIServiceTypes,
        client: ThriftClient,
        response: ThriftResponse,
        limit: number = 100
    ) {
        this.TCLIService_types = TCLIService_types;
        this.client = client;
        this.response = response;
        this.limit = limit;
    }

    execute(): Promise<any> {
        if (!this.response.operationHandle.hasResultSet) {
			return Promise.resolve([]);
		}

		return this.first()
			.then(this.getResult.bind(this));
    }

    private getResult(res: any): Promise<Array<any>> {
        if (!res.hasMoreRows) {
            return Promise.resolve([ res ]);
        }

        return this.next()
            .then(this.getResult.bind(this))
            .then((prevResult: Array<any>) => {
                return [
                    res,
                    ...prevResult,
                ];
            });
    }

    private first() {
        return this.fetchResults({
			orientation: this.TCLIService_types.TFetchOrientation.FETCH_FIRST,
			operationHandle: this.response.operationHandle,
			maxRows: this.limit,
		});
    }

    private next() {
        return this.fetchResults({
			orientation: this.TCLIService_types.TFetchOrientation.FETCH_NEXT,
			operationHandle: this.response.operationHandle,
            maxRows: this.limit,
        });
    }

    private fetchResults(options: object) {
        return new Promise((resolve, reject) => {
            const request = new this.TCLIService_types.TFetchResultsReq(options);	
            
            this.client.FetchResults(request, (err: Error, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
        
    }
}
