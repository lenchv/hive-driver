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

type HandleIdentifier = {
    guid: Buffer | string,
    secret: Buffer | string
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
