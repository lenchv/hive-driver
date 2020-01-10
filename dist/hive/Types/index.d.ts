/// <reference types="node" />
export declare type ThriftClient = {
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
};
export declare type TCLIServiceTypes = {
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
};
export declare type ThriftSession = {
    sessionHandle: any;
};
export declare type Status = {
    statusCode: number;
    infoMessages?: Array<string>;
    sqlState?: string;
    errorCode?: number;
    errorMessage?: string;
};
export declare type ThriftBuffer = Buffer;
declare type HandleIdentifier = {
    guid: ThriftBuffer;
    secret: ThriftBuffer;
};
export declare type SessionHandle = {
    sessionId: HandleIdentifier;
};
export declare type OperationHandle = {
    operationId: HandleIdentifier;
    operationType: number;
    hasResultSet: boolean;
    modifiedRowCount?: number;
};
declare type TypeQualifiers = {
    qualifiers: Map<string, {
        i32Value?: number;
        stringValue?: string;
    }>;
};
declare type PrimitiveTypeEntry = {
    type: number;
    typeQualifiers?: TypeQualifiers;
};
declare type TypeEntryPtr = number;
declare type ArrayTypeEntry = {
    objectTypePtr: TypeEntryPtr;
};
declare type MapTypeEntry = {
    keyTypePtr: TypeEntryPtr;
    valueTypePtr: TypeEntryPtr;
};
declare type StructTypeEntry = {
    nameToTypePtr: Map<string, TypeEntryPtr>;
};
declare type UnionTypeEntry = {
    nameToTypePtr: Map<string, TypeEntryPtr>;
};
declare type UserDefinedTypeEntry = {
    typeClassName: string;
};
declare type TypeEntry = {
    primitiveTypeEntry: PrimitiveTypeEntry;
    arrayTypeEntry: ArrayTypeEntry;
    mapTypeEntry: MapTypeEntry;
    structTypeEntry: StructTypeEntry;
    unionTypeEntry: UnionTypeEntry;
    userDefinedTypeEntry: UserDefinedTypeEntry;
};
declare type TypeDesc = {
    types: Array<TypeEntry>;
};
declare type ColumnDesc = {
    columnName: string;
    typeDesc: TypeDesc;
    position: number;
    comment?: string;
};
export declare type TableSchema = {
    columns: Array<ColumnDesc>;
};
declare type ColumnValue = BoolValue | ByteValue | TI16Value | TI32Value | TI64Value | TDoubleValue | TStringValue;
declare type BoolValue = {
    value: boolean;
};
declare type ByteValue = {
    value: ThriftBuffer;
};
declare type TI16Value = {
    value: number;
};
declare type TI32Value = {
    value: number;
};
declare type TI64Value = {
    value: ThriftBuffer;
};
declare type TDoubleValue = {
    value: number;
};
declare type TStringValue = {
    value: string;
};
declare type Row = {
    colVals: Array<ColumnValue>;
};
declare type TBoolColumn = {
    values: Array<boolean>;
    nulls: ThriftBuffer;
};
declare type TByteColumn = {
    values: Array<ThriftBuffer>;
    nulls: ThriftBuffer;
};
declare type TI16Column = {
    values: Array<number>;
    nulls: ThriftBuffer;
};
declare type TI32Column = {
    values: Array<number>;
    nulls: ThriftBuffer;
};
declare type TI64Column = {
    values: Array<ThriftBuffer>;
    nulls: ThriftBuffer;
};
declare type TDoubleColumn = {
    values: Array<number>;
    nulls: ThriftBuffer;
};
declare type TStringColumn = {
    values: Array<string>;
    nulls: ThriftBuffer;
};
declare type TBinaryColumn = {
    values: Array<ThriftBuffer>;
    nulls: ThriftBuffer;
};
declare type Column = {
    boolVal: TBoolColumn;
    byteVal: TByteColumn;
    i16Val: TI16Column;
    i32Val: TI32Column;
    i64Val: TI64Column;
    doubleVal: TDoubleColumn;
    stringVal: TStringColumn;
    binaryVal: TBinaryColumn;
};
export declare type RowSet = {
    startRowOffset: ThriftBuffer;
    rows: Array<Row>;
    columns?: Array<Column>;
    binaryColumns?: ThriftBuffer;
    columnCount?: number;
};
export declare type GetInfoValue = {
    stringValue: string;
    smallIntValue: number;
    integerBitmask: number;
    integerFlag: number;
    binaryValue: number;
    lenValue: ThriftBuffer;
};
export declare type ProgressUpdateResponse = {
    headerNames: Array<string>;
    rows: Array<Array<string>>;
    progressedPercentage: number;
    status: number;
    footerSummary: string;
    startTime: ThriftBuffer;
};
export {};
