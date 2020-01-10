export type ThriftClient = {
    OpenSession: Function,
    CloseSession: Function,
    GetResultSetMetadata: Function,
    ExecuteStatement: Function,
    FetchResults: Function,
    GetInfo: Function,
    GetTypeInfo: Function,
    GetCatalogs: Function,
    GetSchemas: Function,
    GetTables: Function,
    GetTableTypes: Function,
    GetColumns: Function,
    GetFunctions: Function,
    GetPrimaryKeys: Function,
    GetCrossReference: Function,
    GetOperationStatus: Function,
    CancelOperation: Function,
    CloseOperation: Function,
    GetDelegationToken: Function,
    CancelDelegationToken: Function,
    RenewDelegationToken: Function,
    GetQueryId: Function,
    SetClientInfo: Function,
};

export type TCLIServiceTypes = {
    TOpenSessionReq: any,
    TCloseSessionReq: any,
    TProtocolVersion: any,
    TExecuteStatementReq: any,
    TFetchResultsReq: any,
    TGetInfoReq: any,
    TFetchOrientation: any,
    TGetResultSetMetadataReq: any,
    TGetTypeInfoReq: any,
    TGetCatalogsReq: any,
    TGetSchemasReq: any,
    TGetTablesReq: any,
    TGetTableTypesReq: any,
    TGetColumnsReq: any,
    TGetFunctionsReq: any,
    TGetPrimaryKeysReq: any,
    TGetCrossReferenceReq: any,
    TGetOperationStatusReq: any,
    TCancelOperationReq: any,
    TCloseOperationReq: any,
    TGetDelegationTokenReq: any,
    TCancelDelegationTokenReq: any,
    TRenewDelegationTokenReq: any,
    TGetQueryIdReq: any,
    TSetClientInfoReq: any,
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

export type ThriftBuffer = Buffer;

type HandleIdentifier = {
    guid: ThriftBuffer,
    secret: ThriftBuffer
};

export type SessionHandle = {
    sessionId: HandleIdentifier
};

export type OperationHandle = {
    operationId: HandleIdentifier,
    operationType: number,
    hasResultSet: boolean,
    modifiedRowCount?: number
};

type TypeQualifiers = {
    qualifiers: Map<string, {
        i32Value?: number,
        stringValue?: string
    }>
};

type PrimitiveTypeEntry = {
    type: number,
    typeQualifiers?: TypeQualifiers
};

type TypeEntryPtr = number;

type ArrayTypeEntry = {
    objectTypePtr: TypeEntryPtr
};

type MapTypeEntry = {
    keyTypePtr: TypeEntryPtr,
    valueTypePtr: TypeEntryPtr
};

type StructTypeEntry = {
    nameToTypePtr: Map<string, TypeEntryPtr>
};

type UnionTypeEntry = {
    nameToTypePtr: Map<string, TypeEntryPtr>
};

type UserDefinedTypeEntry = {
    typeClassName: string
};

type TypeEntry = {
    primitiveTypeEntry: PrimitiveTypeEntry,
    arrayTypeEntry: ArrayTypeEntry,
    mapTypeEntry: MapTypeEntry,
    structTypeEntry: StructTypeEntry,
    unionTypeEntry: UnionTypeEntry,
    userDefinedTypeEntry: UserDefinedTypeEntry,
};

type TypeDesc = {
    types: Array<TypeEntry>
};

type ColumnDesc = {
    columnName: string,
    typeDesc: TypeDesc,
    position: number,
    comment?: string
};

export type TableSchema = {
    columns: Array<ColumnDesc>
};

type ColumnValue = BoolValue | ByteValue | TI16Value | TI32Value | TI64Value | TDoubleValue | TStringValue;

type BoolValue = { value: boolean };
type ByteValue = { value: ThriftBuffer };
type TI16Value = { value: number };
type TI32Value = { value: number };
type TI64Value = { value: ThriftBuffer };
type TDoubleValue = { value: number };
type TStringValue = { value: string };

type Row = {
    colVals: Array<ColumnValue>
};

type TBoolColumn = {
    values: Array<boolean>
    nulls: ThriftBuffer
};
type TByteColumn = {
    values: Array<ThriftBuffer>,
    nulls: ThriftBuffer
};
type TI16Column = {
    values: Array<number>,
    nulls: ThriftBuffer
};
type TI32Column = {
    values: Array<number>,
    nulls: ThriftBuffer
};
type TI64Column = {
    values: Array<ThriftBuffer>,
    nulls: ThriftBuffer
};
type TDoubleColumn = {
    values: Array<number>,
    nulls: ThriftBuffer
};
type TStringColumn = {
    values: Array<string>,
    nulls: ThriftBuffer
};
type TBinaryColumn = {
    values: Array<ThriftBuffer>,
    nulls: ThriftBuffer
};

type Column = {
    boolVal: TBoolColumn,
    byteVal: TByteColumn,
    i16Val: TI16Column,
    i32Val: TI32Column,
    i64Val: TI64Column,
    doubleVal: TDoubleColumn,
    stringVal: TStringColumn,
    binaryVal: TBinaryColumn
};

export type RowSet = {
    startRowOffset: ThriftBuffer,
    rows: Array<Row>,
    columns?: Array<Column>,
    binaryColumns?: ThriftBuffer,
    columnCount?: number
};

export type GetInfoValue = {
    stringValue: string,
    smallIntValue: number,
    integerBitmask: number,
    integerFlag: number,
    binaryValue: number,
    lenValue: ThriftBuffer
};

export type ProgressUpdateResponse = {
    headerNames: Array<string>,
    rows: Array<Array<string>>
    progressedPercentage: number,
    status: number,
    footerSummary: string,
    startTime: ThriftBuffer
};
