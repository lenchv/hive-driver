/// <reference types="node" />
export type ThriftClient = {
    OpenSession: Function;
    CloseSession: Function;
    GetResultSetMetadata: Function;
    ExecuteStatement: Function;
    FetchResults: Function;
    GetInfo: Function;
    GetTypeInfo: Function;
    GetCatalogs: Function;
    GetSchemas: Function;
    GetTables: Function;
    GetTableTypes: Function;
    GetColumns: Function;
    GetFunctions: Function;
    GetPrimaryKeys: Function;
    GetCrossReference: Function;
    GetOperationStatus: Function;
    CancelOperation: Function;
    CloseOperation: Function;
    GetDelegationToken: Function;
    CancelDelegationToken: Function;
    RenewDelegationToken: Function;
    GetQueryId: Function;
    SetClientInfo: Function;
    UploadData: Function;
    DownloadData: Function;
};
export type TCLIServiceTypes = {
    TOpenSessionReq: any;
    TCloseSessionReq: any;
    TProtocolVersion: any;
    TExecuteStatementReq: any;
    TFetchResultsReq: any;
    TGetInfoReq: any;
    TFetchOrientation: any;
    TGetResultSetMetadataReq: any;
    TGetTypeInfoReq: any;
    TGetCatalogsReq: any;
    TGetSchemasReq: any;
    TGetTablesReq: any;
    TGetTableTypesReq: any;
    TGetColumnsReq: any;
    TGetFunctionsReq: any;
    TGetPrimaryKeysReq: any;
    TGetCrossReferenceReq: any;
    TGetOperationStatusReq: any;
    TCancelOperationReq: any;
    TCloseOperationReq: any;
    TGetDelegationTokenReq: any;
    TCancelDelegationTokenReq: any;
    TRenewDelegationTokenReq: any;
    TGetQueryIdReq: any;
    TSetClientInfoReq: any;
    TTypeId: any;
    TStatusCode: any;
    TOperationState: any;
    TUploadDataReq: any;
    TDownloadDataReq: any;
};
export type ThriftSession = {
    sessionHandle: any;
};
export type Status = {
    statusCode: number;
    infoMessages?: Array<string>;
    sqlState?: string;
    errorCode?: number;
    errorMessage?: string;
};
export type ThriftBuffer = Buffer;
type HandleIdentifier = {
    guid: ThriftBuffer;
    secret: ThriftBuffer;
};
export type SessionHandle = {
    sessionId: HandleIdentifier;
};
export type OperationHandle = {
    operationId: HandleIdentifier;
    operationType: number;
    hasResultSet: boolean;
    modifiedRowCount?: number;
};
type TypeQualifiers = {
    qualifiers: Map<string, {
        i32Value?: number;
        stringValue?: string;
    }>;
};
export type PrimitiveTypeEntry = {
    type: number;
    typeQualifiers?: TypeQualifiers;
};
type TypeEntryPtr = number;
export type ArrayTypeEntry = {
    objectTypePtr: TypeEntryPtr;
};
export type MapTypeEntry = {
    keyTypePtr: TypeEntryPtr;
    valueTypePtr: TypeEntryPtr;
};
export type StructTypeEntry = {
    nameToTypePtr: Map<string, TypeEntryPtr>;
};
export type UnionTypeEntry = {
    nameToTypePtr: Map<string, TypeEntryPtr>;
};
export type UserDefinedTypeEntry = {
    typeClassName: string;
};
export type TypeEntry = {
    primitiveEntry: PrimitiveTypeEntry;
    arrayEntry: ArrayTypeEntry;
    mapEntry: MapTypeEntry;
    structEntry: StructTypeEntry;
    unionEntry: UnionTypeEntry;
    userDefinedTypeEntry: UserDefinedTypeEntry;
};
export type TypeDesc = {
    types: Array<TypeEntry>;
};
export type ColumnDesc = {
    columnName: string;
    typeDesc: TypeDesc;
    position: number;
    comment?: string;
};
export type TableSchema = {
    columns: Array<ColumnDesc>;
};
type ColumnValue = BoolValue | ByteValue | TI16Value | TI32Value | TI64Value | TDoubleValue | TStringValue;
type BoolValue = {
    value: boolean;
};
type ByteValue = {
    value: ThriftBuffer;
};
type TI16Value = {
    value: number;
};
type TI32Value = {
    value: number;
};
type TI64Value = {
    value: ThriftBuffer;
};
type TDoubleValue = {
    value: number;
};
type TStringValue = {
    value: string;
};
type Row = {
    colVals: Array<ColumnValue>;
};
export type TBoolColumn = {
    values: Array<boolean>;
    nulls: ThriftBuffer;
};
export type TByteColumn = {
    values: Array<ThriftBuffer>;
    nulls: ThriftBuffer;
};
export type TI16Column = {
    values: Array<number>;
    nulls: ThriftBuffer;
};
export type TI32Column = {
    values: Array<number>;
    nulls: ThriftBuffer;
};
export type TI64Column = {
    values: Array<ThriftBuffer>;
    nulls: ThriftBuffer;
};
export type TDoubleColumn = {
    values: Array<number>;
    nulls: ThriftBuffer;
};
export type TStringColumn = {
    values: Array<string>;
    nulls: ThriftBuffer;
};
export type TBinaryColumn = {
    values: Array<ThriftBuffer>;
    nulls: ThriftBuffer;
};
export declare enum ColumnCode {
    boolVal = "boolVal",
    byteVal = "byteVal",
    i16Val = "i16Val",
    i32Val = "i32Val",
    i64Val = "i64Val",
    doubleVal = "doubleVal",
    stringVal = "stringVal",
    binaryVal = "binaryVal"
}
export type ColumnType = TBoolColumn | TByteColumn | TI16Column | TI32Column | TI64Column | TDoubleColumn | TStringColumn | TBinaryColumn;
export type Column = {
    [ColumnCode.boolVal]: TBoolColumn;
    [ColumnCode.byteVal]: TByteColumn;
    [ColumnCode.i16Val]: TI16Column;
    [ColumnCode.i32Val]: TI32Column;
    [ColumnCode.i64Val]: TI64Column;
    [ColumnCode.doubleVal]: TDoubleColumn;
    [ColumnCode.stringVal]: TStringColumn;
    [ColumnCode.binaryVal]: TBinaryColumn;
};
export type RowSet = {
    startRowOffset: ThriftBuffer;
    rows: Array<Row>;
    columns?: Array<Column>;
    binaryColumns?: ThriftBuffer;
    columnCount?: number;
};
export type GetInfoValue = {
    stringValue: string;
    smallIntValue: number;
    integerBitmask: number;
    integerFlag: number;
    binaryValue: number;
    lenValue: ThriftBuffer;
};
export type ProgressUpdateResponse = {
    headerNames: Array<string>;
    rows: Array<Array<string>>;
    progressedPercentage: number;
    status: number;
    footerSummary: string;
    startTime: ThriftBuffer;
};
export declare enum FetchOrientation {
    FETCH_FIRST = 0,
    FETCH_NEXT = 1
}
export {};
