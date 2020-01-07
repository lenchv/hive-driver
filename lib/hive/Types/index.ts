export type ThriftClient = {
    OpenSession: Function,
    CloseSession: Function,
    GetResultSetMetadata: Function,
    ExecuteStatement: Function,
    FetchResults: Function,
};

export type TCLIServiceTypes = {
    TOpenSessionReq: any,
    TCloseSessionReq: any,
    TProtocolVersion: any,
    TExecuteStatementReq: any,
    TFetchResultsReq: any,
    TFetchOrientation: any,
    TGetResultSetMetadataReq: any,
    TTypeId: any,
    TStatusCode: any,
};

export type ThriftSession = {
    sessionHandle: any
};

export type Status = {
    statusCode: number,
    infoMessages?: Array<string>,
    sqlState?: string,
    errorCode?: number,
    errorMessage?: string,
};

export type SessionHandle = any;
